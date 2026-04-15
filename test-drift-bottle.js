// 测试漂流瓶功能
import { useCapsuleStore } from './src/store/useCapsuleStore.ts';

// 测试获取漂流瓶
const store = useCapsuleStore.getState();
console.log('Initial capsules:', store.capsules);
console.log('Current user:', store.currentUser);

const bottle = store.getDriftBottle(store.currentUser.id);
console.log('Found drift bottle:', bottle);
