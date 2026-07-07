// 示範模式資料:尚未連接 Supabase 時,前台以此展示
const demoMarkers = [
  {
    id: 'demo-1',
    name: '台北 101 跨年',
    country: '台灣',
    lat: 25.0336,
    lng: 121.5646,
    description:
      '在台北 101 觀景台看跨年煙火,整座城市的燈光在腳下閃爍。隔天去了象山步道,從另一個角度俯瞰 101,再到永康街吃牛肉麵和芒果冰。',
    travel_start: '2025-12-30',
    travel_end: '2026-01-02',
    media: [
      { id: 'demo-1-1', type: 'image', url: 'https://picsum.photos/seed/taipei1/800/600' },
      { id: 'demo-1-2', type: 'image', url: 'https://picsum.photos/seed/taipei2/800/600' },
    ],
  },
  {
    id: 'demo-2',
    name: '京都紅葉散策',
    country: '日本',
    lat: 35.0116,
    lng: 135.7681,
    description:
      '秋天的京都是一幅畫。清水寺的紅葉、嵐山的竹林、鴨川旁的黃昏,每一步都捨不得走快。晚上在先斗町的小店吃了湯豆腐。',
    travel_start: '2025-11-20',
    travel_end: '2025-11-25',
    media: [
      { id: 'demo-2-1', type: 'image', url: 'https://picsum.photos/seed/kyoto1/800/600' },
      { id: 'demo-2-2', type: 'image', url: 'https://picsum.photos/seed/kyoto2/800/600' },
      { id: 'demo-2-3', type: 'image', url: 'https://picsum.photos/seed/kyoto3/800/600' },
    ],
  },
  {
    id: 'demo-3',
    name: '巴黎左岸咖啡',
    country: '法國',
    lat: 48.8566,
    lng: 2.3522,
    description:
      '在塞納河左岸的咖啡館坐了一下午,看著路人來來去去。羅浮宮排了兩小時但值得,蒙娜麗莎比想像中小很多。鐵塔晚上的燈光秀每整點閃一次。',
    travel_start: '2025-06-10',
    travel_end: '2025-06-17',
    media: [
      { id: 'demo-3-1', type: 'image', url: 'https://picsum.photos/seed/paris1/800/600' },
    ],
  },
  {
    id: 'demo-4',
    name: '沖繩潛水',
    country: '日本',
    lat: 26.2124,
    lng: 127.6809,
    description:
      '青之洞窟浮潛,海水藍得不真實。下午租車環島,在美國村看夕陽,晚餐吃了石垣牛燒肉。',
    travel_start: '2025-08-03',
    travel_end: '2025-08-06',
    media: [
      { id: 'demo-4-1', type: 'image', url: 'https://picsum.photos/seed/okinawa1/800/600' },
      { id: 'demo-4-2', type: 'image', url: 'https://picsum.photos/seed/okinawa2/800/600' },
    ],
  },
  {
    id: 'demo-5',
    name: '紐約中央公園',
    country: '美國',
    lat: 40.7829,
    lng: -73.9654,
    description:
      '秋天的中央公園滿地金黃,租了腳踏車繞了一圈。晚上去看了百老匯的《獅子王》,散場後在時代廣場的人潮裡走了很久。',
    travel_start: '2024-10-15',
    travel_end: '2024-10-22',
    media: [
      { id: 'demo-5-1', type: 'image', url: 'https://picsum.photos/seed/nyc1/800/600' },
    ],
  },
]

export default demoMarkers
