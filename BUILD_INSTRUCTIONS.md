# تعليمات البناء للإنتاج

## 📱 بناء التطبيق للأجهزة المحمولة

### المتطلبات الأساسية
```bash
npm install -g @expo/cli eas-cli
```

### 1. إعداد EAS Build
```bash
# تسجيل الدخول لـ Expo
expo login

# إعداد المشروع
eas build:configure
```

### 2. بناء للأندرويد
```bash
# بناء APK للاختبار
eas build --platform android --profile preview

# بناء AAB للنشر في Google Play
eas build --platform android --profile production
```

### 3. بناء للآيفون
```bash
# بناء للاختبار
eas build --platform ios --profile preview

# بناء للنشر في App Store
eas build --platform ios --profile production
```

### 4. اختبار على الأجهزة الفعلية

#### للأندرويد:
1. حمل ملف APK من Expo Dashboard
2. قم بتثبيته على الجهاز
3. أو استخدم `adb install app.apk`

#### للآيفون:
1. استخدم TestFlight للاختبار
2. أو قم بالتثبيت عبر Xcode للأجهزة المطورة

### 5. النشر في المتاجر

#### Google Play Store:
```bash
eas submit --platform android
```

#### Apple App Store:
```bash
eas submit --platform ios
```

## 🔧 اختبار محلي متقدم

### تشغيل على محاكي أندرويد:
```bash
# تأكد من تشغيل Android Studio
expo run:android
```

### تشغيل على محاكي iOS:
```bash
# تأكد من تشغيل Xcode Simulator
expo run:ios
```

## 📋 قائمة التحقق قبل النشر

- [ ] اختبار جميع الميزات على الأجهزة الفعلية
- [ ] التأكد من أذونات الكاميرا والميكروفون
- [ ] اختبار الأداء على أجهزة مختلفة
- [ ] مراجعة أيقونة التطبيق وشاشة البداية
- [ ] اختبار الاتصال بالإنترنت وبدونه
- [ ] مراجعة سياسة الخصوصية وشروط الاستخدام

## 🚀 نصائح للأداء

1. **تحسين الصور**: استخدم صور محسنة للأجهزة المحمولة
2. **إدارة الذاكرة**: تأكد من تنظيف الموارد غير المستخدمة
3. **التخزين المحلي**: استخدم AsyncStorage للبيانات المهمة
4. **الشبكة**: أضف معالجة أخطاء الشبكة

## 🔐 الأمان

- استخدم متغيرات البيئة للمفاتيح الحساسة
- فعل ProGuard للأندرويد
- استخدم SSL Pinning للاتصالات الآمنة
- أضف Jailbreak/Root Detection إذا لزم الأمر