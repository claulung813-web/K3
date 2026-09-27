export type TopicId =
  | 'family'
  | 'body'
  | 'animals'
  | 'food'
  | 'nature'
  | 'school'
  | 'colors'
  | 'numbers'
  | 'actions'
  | 'travel'

export type Word = {
  id: string
  char: string
  say: string
  jyutping: string
  meaning: string
  emoji: string
  topic: TopicId
}

export type Topic = {
  id: TopicId
  name: string
  hint: string
  emoji: string
  tone: string
}

export const topics: Topic[] = [
  { id: 'family', name: '家庭', hint: '屋企人', emoji: '🏠', tone: 'brick' },
  { id: 'body', name: '身體', hint: '自己', emoji: '👀', tone: 'plum' },
  { id: 'animals', name: '動物', hint: '小動物', emoji: '🐶', tone: 'sun' },
  { id: 'food', name: '食物', hint: '食嘢', emoji: '🍚', tone: 'leaf' },
  { id: 'nature', name: '天地', hint: '大自然', emoji: '🌸', tone: 'sea' },
  { id: 'school', name: '學校', hint: '返學', emoji: '📚', tone: 'ink' },
  { id: 'colors', name: '顏色', hint: '七彩', emoji: '🎨', tone: 'plum' },
  { id: 'numbers', name: '數字', hint: '1 到 10', emoji: '🔢', tone: 'sun' },
  { id: 'actions', name: '動作', hint: '做緊咩', emoji: '🏃', tone: 'leaf' },
  { id: 'travel', name: '出行', hint: '出街', emoji: '🚌', tone: 'sea' },
]

export const words: Word[] = [
  { id: 'baa', char: '爸', say: '爸爸', jyutping: 'baa1', meaning: '爸爸', emoji: '👨', topic: 'family' },
  { id: 'maa', char: '媽', say: '媽媽', jyutping: 'maa1', meaning: '媽媽', emoji: '👩', topic: 'family' },
  { id: 'je', char: '爺', say: '爺爺', jyutping: 'je4', meaning: '爺爺', emoji: '👴', topic: 'family' },
  { id: 'maa4', char: '嫲', say: '嫲嫲', jyutping: 'maa4', meaning: '嫲嫲', emoji: '👵', topic: 'family' },
  { id: 'go', char: '哥', say: '哥哥', jyutping: 'go1', meaning: '哥哥', emoji: '👦', topic: 'family' },
  { id: 'ze', char: '姐', say: '姐姐', jyutping: 'ze2', meaning: '姐姐', emoji: '👧', topic: 'family' },
  { id: 'dai', char: '弟', say: '弟弟', jyutping: 'dai6', meaning: '弟弟', emoji: '🧒', topic: 'family' },
  { id: 'mui', char: '妹', say: '妹妹', jyutping: 'mui6', meaning: '妹妹', emoji: '👶', topic: 'family' },
  { id: 'ngo', char: '我', say: '我', jyutping: 'ngo5', meaning: '自己', emoji: '🙂', topic: 'family' },
  { id: 'nei', char: '你', say: '你', jyutping: 'nei5', meaning: '你', emoji: '👋', topic: 'family' },
  { id: 'gaa', char: '家', say: '家', jyutping: 'gaa1', meaning: '屋企', emoji: '🏡', topic: 'family' },

  { id: 'sau', char: '手', say: '手', jyutping: 'sau2', meaning: '手', emoji: '✋', topic: 'body' },
  { id: 'goek', char: '腳', say: '腳', jyutping: 'goek3', meaning: '腳', emoji: '🦶', topic: 'body' },
  { id: 'ngaan', char: '眼', say: '眼睛', jyutping: 'ngaan5', meaning: '眼睛', emoji: '👁️', topic: 'body' },
  { id: 'ji', char: '耳', say: '耳朵', jyutping: 'ji5', meaning: '耳朵', emoji: '👂', topic: 'body' },
  { id: 'hau', char: '口', say: '口', jyutping: 'hau2', meaning: '嘴巴', emoji: '👄', topic: 'body' },
  { id: 'bei', char: '鼻', say: '鼻子', jyutping: 'bei6', meaning: '鼻子', emoji: '👃', topic: 'body' },
  { id: 'tau', char: '頭', say: '頭', jyutping: 'tau4', meaning: '頭', emoji: '🧑', topic: 'body' },
  { id: 'ngaa', char: '牙', say: '牙齒', jyutping: 'ngaa4', meaning: '牙齒', emoji: '🦷', topic: 'body' },
  { id: 'sam', char: '心', say: '心', jyutping: 'sam1', meaning: '心口', emoji: '❤️', topic: 'body' },

  { id: 'maau', char: '貓', say: '貓', jyutping: 'maau1', meaning: '貓貓', emoji: '🐱', topic: 'animals' },
  { id: 'gau', char: '狗', say: '狗', jyutping: 'gau2', meaning: '狗狗', emoji: '🐶', topic: 'animals' },
  { id: 'jyu', char: '魚', say: '魚', jyutping: 'jyu4', meaning: '魚仔', emoji: '🐟', topic: 'animals' },
  { id: 'niu', char: '鳥', say: '雀仔', jyutping: 'niu5', meaning: '雀仔', emoji: '🐦', topic: 'animals' },
  { id: 'gai', char: '雞', say: '雞', jyutping: 'gai1', meaning: '雞', emoji: '🐔', topic: 'animals' },
  { id: 'ngau', char: '牛', say: '牛', jyutping: 'ngau4', meaning: '牛牛', emoji: '🐮', topic: 'animals' },
  { id: 'joeng', char: '羊', say: '羊', jyutping: 'joeng4', meaning: '羊仔', emoji: '🐑', topic: 'animals' },
  { id: 'zyu', char: '豬', say: '豬', jyutping: 'zyu1', meaning: '豬仔', emoji: '🐷', topic: 'animals' },
  { id: 'tou', char: '兔', say: '兔仔', jyutping: 'tou3', meaning: '兔仔', emoji: '🐰', topic: 'animals' },
  { id: 'maa5', char: '馬', say: '馬', jyutping: 'maa5', meaning: '馬仔', emoji: '🐴', topic: 'animals' },

  { id: 'faan', char: '飯', say: '飯', jyutping: 'faan6', meaning: '飯', emoji: '🍚', topic: 'food' },
  { id: 'min', char: '麵', say: '麵', jyutping: 'min6', meaning: '麵', emoji: '🍜', topic: 'food' },
  { id: 'daan', char: '蛋', say: '蛋', jyutping: 'daan6', meaning: '蛋', emoji: '🥚', topic: 'food' },
  { id: 'naai', char: '奶', say: '奶', jyutping: 'naai5', meaning: '牛奶', emoji: '🥛', topic: 'food' },
  { id: 'seoi', char: '水', say: '水', jyutping: 'seoi2', meaning: '水', emoji: '💧', topic: 'food' },
  { id: 'caa', char: '茶', say: '茶', jyutping: 'caa4', meaning: '茶', emoji: '🍵', topic: 'food' },
  { id: 'coi', char: '菜', say: '菜', jyutping: 'coi3', meaning: '蔬菜', emoji: '🥬', topic: 'food' },
  { id: 'gwo', char: '果', say: '生果', jyutping: 'gwo2', meaning: '生果', emoji: '🍎', topic: 'food' },
  { id: 'tong', char: '糖', say: '糖', jyutping: 'tong4', meaning: '糖', emoji: '🍬', topic: 'food' },
  { id: 'beng', char: '餅', say: '餅', jyutping: 'beng2', meaning: '餅乾', emoji: '🍪', topic: 'food' },

  { id: 'jat', char: '日', say: '太陽', jyutping: 'jat6', meaning: '太陽', emoji: '☀️', topic: 'nature' },
  { id: 'jyut', char: '月', say: '月亮', jyutping: 'jyut6', meaning: '月亮', emoji: '🌙', topic: 'nature' },
  { id: 'sing', char: '星', say: '星星', jyutping: 'sing1', meaning: '星星', emoji: '⭐', topic: 'nature' },
  { id: 'tin', char: '天', say: '天', jyutping: 'tin1', meaning: '天空', emoji: '🌤️', topic: 'nature' },
  { id: 'jyu5', char: '雨', say: '雨', jyutping: 'jyu5', meaning: '落雨', emoji: '🌧️', topic: 'nature' },
  { id: 'fung', char: '風', say: '風', jyutping: 'fung1', meaning: '風', emoji: '💨', topic: 'nature' },
  { id: 'faa', char: '花', say: '花', jyutping: 'faa1', meaning: '花', emoji: '🌸', topic: 'nature' },
  { id: 'cou', char: '草', say: '草', jyutping: 'cou2', meaning: '草地', emoji: '🌱', topic: 'nature' },
  { id: 'syu6', char: '樹', say: '樹', jyutping: 'syu6', meaning: '樹', emoji: '🌳', topic: 'nature' },
  { id: 'saan', char: '山', say: '山', jyutping: 'saan1', meaning: '山', emoji: '⛰️', topic: 'nature' },
  { id: 'hoi', char: '海', say: '海', jyutping: 'hoi2', meaning: '大海', emoji: '🌊', topic: 'nature' },

  { id: 'syu1', char: '書', say: '書', jyutping: 'syu1', meaning: '書本', emoji: '📖', topic: 'school' },
  { id: 'bat', char: '筆', say: '筆', jyutping: 'bat1', meaning: '筆', emoji: '✏️', topic: 'school' },
  { id: 'zi', char: '紙', say: '紙', jyutping: 'zi2', meaning: '紙', emoji: '📄', topic: 'school' },
  { id: 'hok', char: '學', say: '學習', jyutping: 'hok6', meaning: '學習', emoji: '🎒', topic: 'school' },
  { id: 'haau', char: '校', say: '學校', jyutping: 'haau6', meaning: '學校', emoji: '🏫', topic: 'school' },
  { id: 'si', char: '師', say: '老師', jyutping: 'si1', meaning: '老師', emoji: '👩‍🏫', topic: 'school' },
  { id: 'jau', char: '友', say: '朋友', jyutping: 'jau5', meaning: '朋友', emoji: '🤝', topic: 'school' },

  { id: 'hung', char: '紅', say: '紅色', jyutping: 'hung4', meaning: '紅色', emoji: '🔴', topic: 'colors' },
  { id: 'wong', char: '黃', say: '黃色', jyutping: 'wong4', meaning: '黃色', emoji: '🟡', topic: 'colors' },
  { id: 'laam', char: '藍', say: '藍色', jyutping: 'laam4', meaning: '藍色', emoji: '🔵', topic: 'colors' },
  { id: 'luk', char: '綠', say: '綠色', jyutping: 'luk6', meaning: '綠色', emoji: '🟢', topic: 'colors' },
  { id: 'baak', char: '白', say: '白色', jyutping: 'baak6', meaning: '白色', emoji: '⚪', topic: 'colors' },
  { id: 'hak', char: '黑', say: '黑色', jyutping: 'hak1', meaning: '黑色', emoji: '⚫', topic: 'colors' },
  { id: 'zi2', char: '紫', say: '紫色', jyutping: 'zi2', meaning: '紫色', emoji: '🟣', topic: 'colors' },

  { id: 'jat1', char: '一', say: '一', jyutping: 'jat1', meaning: '1', emoji: '1️⃣', topic: 'numbers' },
  { id: 'ji6', char: '二', say: '二', jyutping: 'ji6', meaning: '2', emoji: '2️⃣', topic: 'numbers' },
  { id: 'saam', char: '三', say: '三', jyutping: 'saam1', meaning: '3', emoji: '3️⃣', topic: 'numbers' },
  { id: 'sei', char: '四', say: '四', jyutping: 'sei3', meaning: '4', emoji: '4️⃣', topic: 'numbers' },
  { id: 'ng5', char: '五', say: '五', jyutping: 'ng5', meaning: '5', emoji: '5️⃣', topic: 'numbers' },
  { id: 'luk6', char: '六', say: '六', jyutping: 'luk6', meaning: '6', emoji: '6️⃣', topic: 'numbers' },
  { id: 'cat', char: '七', say: '七', jyutping: 'cat1', meaning: '7', emoji: '7️⃣', topic: 'numbers' },
  { id: 'baat', char: '八', say: '八', jyutping: 'baat3', meaning: '8', emoji: '8️⃣', topic: 'numbers' },
  { id: 'gau2', char: '九', say: '九', jyutping: 'gau2', meaning: '9', emoji: '9️⃣', topic: 'numbers' },
  { id: 'sap', char: '十', say: '十', jyutping: 'sap6', meaning: '10', emoji: '🔟', topic: 'numbers' },

  { id: 'zau', char: '走', say: '走', jyutping: 'zau2', meaning: '行路', emoji: '🚶', topic: 'actions' },
  { id: 'paau', char: '跑', say: '跑', jyutping: 'paau2', meaning: '跑步', emoji: '🏃', topic: 'actions' },
  { id: 'tiu', char: '跳', say: '跳', jyutping: 'tiu3', meaning: '跳高', emoji: '🤸', topic: 'actions' },
  { id: 'hon', char: '看', say: '看', jyutping: 'hon3', meaning: '睇', emoji: '👀', topic: 'actions' },
  { id: 'teng', char: '聽', say: '聽', jyutping: 'teng1', meaning: '聽', emoji: '🎧', topic: 'actions' },
  { id: 'sik', char: '食', say: '食', jyutping: 'sik6', meaning: '食嘢', emoji: '🍽️', topic: 'actions' },
  { id: 'co5', char: '坐', say: '坐', jyutping: 'co5', meaning: '坐下', emoji: '🪑', topic: 'actions' },
  { id: 'waan', char: '玩', say: '玩', jyutping: 'waan2', meaning: '玩遊戲', emoji: '🎮', topic: 'actions' },
  { id: 'siu', char: '笑', say: '笑', jyutping: 'siu3', meaning: '笑', emoji: '😄', topic: 'actions' },

  { id: 'ce', char: '車', say: '車', jyutping: 'ce1', meaning: '汽車', emoji: '🚗', topic: 'travel' },
  { id: 'syun', char: '船', say: '船', jyutping: 'syun4', meaning: '船', emoji: '🚢', topic: 'travel' },
  { id: 'fei', char: '飛', say: '飛', jyutping: 'fei1', meaning: '飛', emoji: '✈️', topic: 'travel' },
  { id: 'gei', char: '機', say: '飛機', jyutping: 'gei1', meaning: '飛機', emoji: '🛫', topic: 'travel' },
  { id: 'lou', char: '路', say: '路', jyutping: 'lou6', meaning: '馬路', emoji: '🛣️', topic: 'travel' },
  { id: 'mun', char: '門', say: '門', jyutping: 'mun4', meaning: '門', emoji: '🚪', topic: 'travel' },
  { id: 'baa1', char: '巴', say: '巴士', jyutping: 'baa1', meaning: '巴士', emoji: '🚌', topic: 'travel' },
]

export function wordsForTopic(topicId: TopicId | 'all'): Word[] {
  if (topicId === 'all') return words
  return words.filter((word) => word.topic === topicId)
}

export function topicById(topicId: TopicId): Topic {
  return topics.find((topic) => topic.id === topicId) ?? topics[0]
}
