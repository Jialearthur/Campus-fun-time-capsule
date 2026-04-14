export interface Template {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
  fontStyle: {
    color: string;
    fontFamily: string;
  };
  tags: string[];
  placeholder: string;
}

export const templates: Template[] = [
  {
    id: 'campus-daily',
    name: '校园日常回忆',
    description: '记录校园里的日常点滴，上课、自习、食堂的美好时光',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=university%20campus%20daily%20life%20warm%20atmosphere%20blurry%20background&image_size=landscape_16_9',
    fontStyle: {
      color: '#333333',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['教学楼', '食堂', '图书馆', '室友日常'],
    placeholder: '今天和室友一起去食堂吃饭，发现了新的美食窗口...'
  },
  {
    id: 'graduation-wish',
    name: '毕业期许',
    description: '对未来的自己说的话，毕业前的美好祝愿',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=university%20graduation%20ceremony%20cap%20and%20gown%20warm%20lighting&image_size=landscape_16_9',
    fontStyle: {
      color: '#5a3d5c',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['毕业季', '未来', '青春', '梦想'],
    placeholder: '四年时光转瞬即逝，希望未来的自己...'
  },
  {
    id: 'friend-agreement',
    name: '好友约定',
    description: '和好朋友的约定，一起实现的梦想和计划',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friends%20hanging%20out%20on%20campus%20happy%20memories&image_size=landscape_16_9',
    fontStyle: {
      color: '#2d5016',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['好友', '约定', '友谊', '回忆'],
    placeholder: '和最好的朋友约定，十年后再回到这里...'
  },
  {
    id: 'club-time',
    name: '社团时光',
    description: '记录社团活动的精彩瞬间，团队合作的快乐',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=university%20club%20activity%20teamwork%20colorful&image_size=landscape_16_9',
    fontStyle: {
      color: '#8b0000',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['社团活动', '团队', '兴趣', '成长'],
    placeholder: '今天社团活动很成功，大家一起努力的感觉真好...'
  }
];

export const campusTags = [
  '教学楼', '食堂', '图书馆', '室友日常', '社团活动',
  '毕业季', '考试周', '操场', '自习室', '校园活动',
  '朋友聚会', '校园风景', '课堂笔记', '校园美食', '体育赛事'
];
