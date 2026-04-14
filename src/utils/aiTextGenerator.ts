import { AITextTemplate } from '../types';

const warmTemplates = [
  '还记得那年{keyword1}，我们一起在{keyword2}，那段时光真的很美好。希望未来的我们还能保持这份纯粹的友谊，永远记得今天的自己。',
  '今天的{keyword1}让我想起了我们曾经一起经历的{keyword2}，那些画面至今仍历历在目。感谢有你们陪伴我走过这段青春岁月。',
  '在{keyword1}的日子里，{keyword2}成了我最珍贵的回忆。多年以后再看这段文字，希望还能感受到今天的温暖和感动。'
];

const funnyTemplates = [
  '哈哈！今天干了件大事——{keyword1}！想起上次{keyword2}，我们简直是校园里的一股泥石流！未来的我看到这段，请不要笑太大声！',
  '救命！{keyword1}真的太好笑了！还记得我们{keyword2}的样子吗？现在想想都觉得社死，但又好怀念那种无忧无虑的快乐！',
  '记录一下今天的{keyword1}！谁能想到我们居然会{keyword2}！未来的你要是看到这个，记得给当时的自己点个赞，太勇了！'
];

const literaryTemplates = [
  '时光荏苒，{keyword1}如白驹过隙。在这{keyword2}的季节里，我将这份心情封存于时光胶囊之中，静待岁月开封。',
  '流年暗中偷换，{keyword1}成了青春里最美的注脚。愿多年后再读这段文字，{keyword2}的记忆依然鲜活如初。',
  '在这个特别的日子里，以文字为笺，以{keyword1}为墨，写下关于{keyword2}的诗行，寄给未来的自己。'
];

export const generateAITextTemplates = (keywords: string[]): AITextTemplate[] => {
  const keyword1 = keywords[0] || '校园时光';
  const keyword2 = keywords[1] || '青春岁月';
  const keyword3 = keywords[2] || '美好回忆';

  const templates: AITextTemplate[] = [
    {
      id: '1',
      style: 'warm',
      styleName: '温馨治愈',
      content: warmTemplates[Math.floor(Math.random() * warmTemplates.length)]
        .replace(/\{keyword1\}/g, keyword1)
        .replace(/\{keyword2\}/g, keyword2)
        .replace(/\{keyword3\}/g, keyword3)
    },
    {
      id: '2',
      style: 'funny',
      styleName: '活泼搞笑',
      content: funnyTemplates[Math.floor(Math.random() * funnyTemplates.length)]
        .replace(/\{keyword1\}/g, keyword1)
        .replace(/\{keyword2\}/g, keyword2)
        .replace(/\{keyword3\}/g, keyword3)
    },
    {
      id: '3',
      style: 'literary',
      styleName: '文艺清新',
      content: literaryTemplates[Math.floor(Math.random() * literaryTemplates.length)]
        .replace(/\{keyword1\}/g, keyword1)
        .replace(/\{keyword2\}/g, keyword2)
        .replace(/\{keyword3\}/g, keyword3)
    }
  ];

  return templates;
};

export const getStyleIcon = (style: string) => {
  switch (style) {
    case 'warm':
      return '❤️';
    case 'funny':
      return '😂';
    case 'literary':
      return '🌸';
    default:
      return '✍️';
  }
};

export const getStyleColor = (style: string) => {
  switch (style) {
    case 'warm':
      return 'from-pink-200 to-rose-200';
    case 'funny':
      return 'from-yellow-200 to-orange-200';
    case 'literary':
      return 'from-green-200 to-teal-200';
    default:
      return 'from-gray-200 to-slate-200';
  }
};
