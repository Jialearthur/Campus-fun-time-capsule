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
  isLimited?: boolean;
  limitedType?: 'seasonal' | 'festival';
  startDate?: string;
  endDate?: string;
  limitedBadge?: string;
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
  },
  // 限定模板
  {
    id: 'back-to-school',
    name: '开学季限定',
    description: '新学期，新开始，记录开学的激动心情',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=back%20to%20school%20campus%20theme%20colorful%20fresh%20start&image_size=landscape_16_9',
    fontStyle: {
      color: '#2c5282',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['开学季', '新学期', '新开始', '希望'],
    placeholder: '新学期开始了，充满期待的一天...',
    isLimited: true,
    limitedType: 'seasonal',
    startDate: '2024-08-15',
    endDate: '2024-09-30',
    limitedBadge: '开学季限定'
  },
  {
    id: 'graduation-season',
    name: '毕业季限定',
    description: '青春不散场，记录毕业的珍贵时刻',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=graduation%20ceremony%20campus%20theme%20emotional%20moment&image_size=landscape_16_9',
    fontStyle: {
      color: '#805ad5',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['毕业季', '青春', '离别', '未来'],
    placeholder: '今天毕业了，和同学们一起拍照留念...',
    isLimited: true,
    limitedType: 'seasonal',
    startDate: '2024-05-15',
    endDate: '2024-06-30',
    limitedBadge: '毕业季限定'
  },
  {
    id: 'mid-autumn',
    name: '中秋限定',
    description: '月圆人团圆，记录中秋校园的温馨时光',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mid%20autumn%20festival%20moon%20campus%20night%20warm&image_size=landscape_16_9',
    fontStyle: {
      color: '#d69e2e',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['中秋', '团圆', '校园', '温馨'],
    placeholder: '中秋夜晚，和室友一起在校园里赏月...',
    isLimited: true,
    limitedType: 'festival',
    startDate: '2024-09-10',
    endDate: '2024-09-30',
    limitedBadge: '中秋限定'
  },
  {
    id: 'new-year',
    name: '元旦限定',
    description: '新年新希望，记录跨年的美好瞬间',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20year%20celebration%20campus%20theme%20fireworks&image_size=landscape_16_9',
    fontStyle: {
      color: '#e53e3e',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['元旦', '新年', '希望', '跨年'],
    placeholder: '跨年倒计时，和朋友们一起迎接新年...',
    isLimited: true,
    limitedType: 'festival',
    startDate: '2023-12-20',
    endDate: '2024-01-10',
    limitedBadge: '元旦限定'
  },
  {
    id: 'school-anniversary',
    name: '校庆限定',
    description: '母校华诞，记录校庆的喜庆氛围',
    backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=school%20anniversary%20celebration%20campus%20festive&image_size=landscape_16_9',
    fontStyle: {
      color: '#718096',
      fontFamily: '"Noto Sans SC", sans-serif'
    },
    tags: ['校庆', '母校', '庆典', '荣誉'],
    placeholder: '今天是母校的生日，校园里充满了喜庆的氛围...',
    isLimited: true,
    limitedType: 'festival',
    startDate: '2024-10-15',
    endDate: '2024-10-30',
    limitedBadge: '校庆限定'
  }
];

export const campusTags = [
  '教学楼', '食堂', '图书馆', '室友日常', '社团活动',
  '毕业季', '考试周', '操场', '自习室', '校园活动',
  '朋友聚会', '校园风景', '课堂笔记', '校园美食', '体育赛事'
];

export function getAvailableLimitedTemplates(): Template[] {
  const currentDate = new Date();
  const currentDateStr = currentDate.toISOString().split('T')[0];
  
  return templates.filter(template => {
    if (!template.isLimited || !template.startDate || !template.endDate) {
      return false;
    }
    return currentDateStr >= template.startDate && currentDateStr <= template.endDate;
  });
}

export function getCurrentLimitedBadges(): string[] {
  const availableLimitedTemplates = getAvailableLimitedTemplates();
  return Array.from(new Set(availableLimitedTemplates.map(t => t.limitedBadge!).filter(Boolean)));
}
