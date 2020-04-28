// 素材相关请求模块

import request from '@/utils/request'

// 上传图片素材
export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
  })
}

// 获取素材列表
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏图片素材
export const isCollectImage = (collect, id) => {
  return request({
    method: 'PUT',
    url: ` /mp/v1_0/user/images/${id}`,
    data: {
      collect
    }
  })
}

// 删除图片素材
export const delImage = id => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${id}`
  })
}
