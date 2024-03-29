<template>
  <div class="comments">
    <div class="comment_hd">
      <h2>
        评论<em>共{{ total }}条评论</em>
      </h2>
      <div class="userInfo" v-if="userInfo">
        <span>{{ userInfo.nickname }}</span>
        <el-image :src="userInfo.avatarUrl" class="avatar">
          <div slot="placeholder" class="image-slot">
            <i class="iconfont icon-placeholder"></i>
          </div>
        </el-image>
      </div>
    </div>
    <el-form class="comment_box" v-if="userInfo">
      <div class="comment_textarea">
        <div class="pre">{{ msg }}</div>
        <textarea
          class="J_inpBox inp-paragraph"
          name="leave_msg"
          id="leave_msg"
          placeholder="期待你的神评论……"
          v-model="msg"
        ></textarea>
      </div>
      <div class="comment_box_footer">
        <el-button type="primary" color="#ff641e" @click="subComment">评论</el-button>
        <span class="comment_limit"
          ><em class="num">{{ msg.length }}</em
          >/{{ maxLen }}</span
        >
      </div>
    </el-form>
    <div class="comment_box_notlogin" v-else>
      <div>请登录后评论</div>
    </div>
    <div class="comment_area">
      <template v-if="comments.length">
        <div class="comment_item" v-for="(item, index) in comments" :key="item.commentId + index + ''">
          <router-link :to="{ path: '/user', query: { id: item.user.userId } }" class="comment_avatar">
            <el-image :src="item.user.avatarUrl + '?param=120y120'">
              <div slot="placeholder" class="image-slot">
                <i class="iconfont icon-placeholder"></i>
              </div>
            </el-image>
          </router-link>
          <div class="comment_info">
            <router-link :to="{ path: '/user', query: { id: item.user.userId } }">{{
              item.user.nickname
            }}</router-link>
            <div class="comment_content">
              {{ item.content }}
            </div>
            <div
              class="comment_reply"
              v-for="replyItem in item.beReplied"
              :key="replyItem.beRepliedCommentId"
            >
              <router-link :to="{ path: '/user', query: { id: replyItem.user.userId } }">{{
                replyItem.user.nickname
              }}</router-link
              >: {{ replyItem.content }}
            </div>
            <div class="comment_footer">
              <div class="comment_time">{{ $utils.formatMsgTime(item.time) }}</div>
              <div class="comment_oper">
                <em
                  class="comment_del"
                  v-if="userInfo && userInfo.userId === item.user.userId"
                  @click="delComment(item)"
                  ><i class="iconfont icon-del"></i
                ></em>
                <span :class="[item.liked ? 'active' : '']" @click="likeComment(item)"
                  ><i class="iconfont icon-praise"></i>({{ item.likedCount }})</span
                >
                <span class="replyComment" @click="replyComment(item, index)"
                  ><i class="iconfont icon-comment"></i
                ></span>
              </div>
            </div>
            <div class="isHot" v-if="item.isHot">
              <i class="iconfont icon-hot"></i>
            </div>
            <transition name="fade" mode="out-in">
              <ReplyComment :params="item" v-if="isShowReply(item, index)" @replyMsg="replyMsg" />
            </transition>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </template>
      <div v-else class="comments_status">
        <div class="loading" v-if="!isEmpty">评论加载中...</div>
        <div class="empty" v-else>
          <p><i class="iconfont icon-empty-main"></i></p>
          <p>暂无留言</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import ReplyComment from '@/components/Reply.vue'
import { getCurrentInstance, computed, onMounted, watch, reactive, ref, toRefs } from 'vue'

const props = defineProps({
  sId: {
    type: [Number, String],
    default: 0,
  },
  type: {
    type: Number,
    default: 0,
  },
})

const { proxy } = getCurrentInstance()
const store = useStore()
const info = reactive({
  msg: '',
  maxLen: 140,
  curId: props.sId,
  offset: 0,
  before: 0,
  hotComments: [],
  comments: [],
  currentPage: 1,
  limit: 10,
  total: 0,
  isEmpty: false,
  replyCommentId: 0,
  replyIndex: -1,
})
const {
  msg,
  maxLen,
  curId,
  limit,
  offset,
  before,
  hotComments,
  comments,
  total,
  currentPage,
  isEmpty,
  replyCommentId,
  replyIndex,
} = toRefs(info)

const userInfo = computed(() => store.getters.userInfo)
const isLogin = computed(() => store.getters.isLogin)
const isShowReply = computed(() => {
  return function (item, index) {
    return item.commentId === info.replyCommentId && info.replyIndex === index
  }
})

// 获取页面评论
const getComment = () => {
  // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
  switch (props.type) {
    case 0:
      getCommentList('commentSong')
      break
    case 1:
      getCommentList('commentMv')
      break
    case 3:
      getCommentList('albumComment')
      break
    case 5:
      getCommentList('commentVideo')
      break
  }
}

const getCommentList = async (type) => {
  console.log(type)
  const { data: res } = await proxy.$http[type]({
    id: info.curId,
    limit: info.limit,
    offset: info.offset,
    before: info.before,
    timestamp: new Date().valueOf(),
  })

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.total = res.total
  info.hotComments = res.hotComments?.slice(0, 5) || []
  info.hotComments.map((item) => {
    item.isHot = true
    return item
  })
  info.comments = [...info.hotComments, ...res.comments]
  // 当前评论是否为空
  info.isEmpty = info.before === 0 && !info.comments.length
}

// 发布/删除/回复评论
const commentHandler = async (t, content, commentId) => {
  const params = {
    t: t, // 0删除 1发送 2回复
    type: props.type, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    id: info.curId, // 对应资源id
    content: content, // 发送的内容/对应内容的id
    commentId: commentId, // 回复的评论id
  }
  const { data: res } = await proxy.$http.comment(params)
  window.console.log(res)
  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  info.msg = ''
  getComment()

  if (t === 0) {
    proxy.$msg.success('删除评论成功！')
  } else if (t === 1) {
    proxy.$msg.success('评论成功！')
  } else if (t === 2) {
    proxy.$msg.success('回复评论成功！')
    info.replyCommentId = 0
    info.replyIndex = -1
  }
}

// 发布评论
const subComment = async () => {
  // if (!isLogin.value) {
  //   store.commit('SET_LOGINDIALOG', true)
  //   return
  // }
  commentHandler(1, info.msg)
}

// 删除评论
const delComment = (item) => {
  ElMessageBox.confirm('确定删除评论？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true,
  })
    .then(() => {
      commentHandler(0, '', item.commentId)
    })
    .catch(() => {})
}

// 回复评论
const replyComment = (item, index) => {
  // if (!isLogin.value) {
  //   store.commit('SET_LOGINDIALOG', true)
  //   return
  // }
  info.replyCommentId =
    info.replyCommentId === item.commentId && info.replyIndex === index ? 0 : item.commentId
  info.replyIndex = index
}

const replyMsg = (msg) => {
  if (!isLogin.value) {
    store.commit('SET_LOGINDIALOG', true)
    return
  }
  commentHandler(2, msg, info.replyCommentId)
}

// 给评论点赞
const likeComment = async (item) => {
  // if (!isLogin.value) {
  //   store.commit('SET_LOGINDIALOG', true)
  //   return
  // }

  const { data: res } = await proxy.$http.commentLike({
    id: info.curId,
    cid: item.commentId,
    t: Number(!item.liked),
    type: props.type,
  })

  if (res.code !== 200) {
    return proxy.$msg.error('数据请求失败')
  }
  getComment()
}

// 留言分页
const currentChange = (page) => {
  info.offset = (page - 1) * info.limit
  info.currentPage = page
  getComment()
}

onMounted(() => {
  getComment()
})

watch(
  () => props.sId,
  (newVal, oldVal) => {
    info.curId = newVal
    info.offset = 0
    getComment()
  }
)

watch(
  () => info.msg,
  () => {
    info.msg = info.maxLen >= info.msg ? info.msg : info.msg.substring(0, info.maxLen)
  }
)
</script>
<style scoped lang="less">
.comments {
  padding-top: 30px;
}

.comment_hd {
  display: flex;
  align-items: center;
  height: 60px;
  font-size: 0;

  h2 {
    flex: 1;
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;

    em {
      padding-left: 20px;
      font-size: 14px;
      line-height: 14px;
      font-style: normal;
      color: #999;
    }
  }

  .userInfo {
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      vertical-align: top;
    }

    span {
      display: inline-block;
      padding: 0 20px;
      line-height: 30px;
      font-size: 14px;
      color: #666;
    }
  }
}

.comment_box {
  .comment_textarea {
    position: relative;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    background: #fff;
  }

  .pre {
    visibility: hidden;
  }

  .inp-paragraph {
    position: absolute;
    top: 0;
    left: 0;
    height: calc(100% - 20px);
    resize: none;
    width: auto;
    padding: 0;
    border: 0;
    margin: 0;
    font-family: inherit;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
  }

  .inp-paragraph,
  .pre {
    width: calc(100% - 30px);
    padding: 10px 15px;
    line-height: 24px;
    min-height: 90px;
    font-size: 14px;
    color: #333;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .comment_box_footer {
    display: flex;
    padding: 15px 0 50px;
    justify-content: space-between;
  }

  .comment_limit {
    display: inline-block;
    line-height: 28px;
    padding: 0 0 0 20px;
    font-size: 14px;
    color: #666;

    em {
      font-style: normal;
    }
  }
}
.comment_box_notlogin {
  div {
    height: 40px;
    line-height: 40px;
    color: var(--color-text);
  }
  .btn {
    margin: 40px 0;
  }
}

.comments_status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  .loading {
    font-size: 14px;
    line-height: 24px;
    color: #999;
  }

  .empty {
    text-align: center;

    p {
      font-size: 14px;
      line-height: 24px;
      color: #999;
    }

    .icon-empty-main {
      line-height: 140px;
      font-size: 100px;
      color: #bbb;
      opacity: 0.8;
    }
  }
}

.comment_item {
  position: relative;
  display: flex;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;
  background: #fff;

  .comment_avatar {
    display: in;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
  }

  .comment_info {
    flex: 1;
    padding-left: 20px;

    a {
      display: inline-block;
      padding-bottom: 10px;
      line-height: 14px;
      color: #999;

      &:hover {
        color: var(--color-text);
      }
    }
  }

  .comment_content {
    width: 700px;
    line-height: 24px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-break: break-word;
    overflow: hidden;
  }

  .comment_reply {
    padding: 10px;
    line-height: 28px;
    margin: 5px 0;
    color: #666;
    background: #fafafa;
    border-radius: 6px;
    box-shadow: 0 0px 27px rgb(0 0 0 / 6%) inset;

    a {
      display: inline-block;
      line-height: 28px;
      padding: 0;
    }
  }

  .comment_footer {
    display: flex;
    color: #999;

    .comment_time {
      display: inline-block;
      line-height: 28px;
    }

    .comment_oper {
      flex: 1;
      text-align: right;

      span {
        display: inline-block;
        margin-left: 15px;
        line-height: 28px;
        cursor: pointer;

        &.active,
        &.active .iconfont {
          color: var(--color-text);
        }
      }
    }
  }

  .isHot {
    position: absolute;
    right: 0;
    top: -8px;
    z-index: 1;
    // transform: rotate(45deg);

    .icon-hot {
      font-size: 30px;
      color: rgb(255, 94, 94);
      opacity: 0.8;
    }
  }

  .comment_del {
    cursor: pointer;
    display: none;
  }

  &:hover {
    .comment_del {
      display: inline-block;
    }
  }

  &:last-child {
    border: none;
  }
}

.pagination {
  padding: 30px 0;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
