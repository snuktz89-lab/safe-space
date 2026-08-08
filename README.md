# แสงที่ไม่มีชื่อ (SafeLight)

พื้นที่โพสต์เรื่องราวการถูกบูลลี่แบบไม่ระบุตัวตน

## ขั้นตอนตั้งค่าก่อน deploy

### 1. สร้างฐานข้อมูล Supabase (ฟรี)

1. ไปที่ https://supabase.com สมัครและสร้างโปรเจกต์ใหม่
2. เข้า **SQL Editor** > **New query** แล้ววางเนื้อหาจากไฟล์ `supabase_schema.sql`
   ที่แนบมา แล้วกด Run
3. ไปที่ **Project Settings > API** คัดลอกค่า:
   - `Project URL` → ใช้เป็น `VITE_SUPABASE_URL`
   - `anon public` key → ใช้เป็น `VITE_SUPABASE_ANON_KEY`

### 2. ตั้งค่าตัวแปรแวดล้อม

คัดลอก `.env.example` เป็น `.env` แล้วใส่ค่าจากขั้นตอนที่ 1:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxx
```

### 3. รันทดสอบในเครื่อง (ไม่บังคับ)

```
npm install
npm run dev
```

เปิด http://localhost:5173

## Deploy ขึ้น Vercel

1. Push โค้ดนี้ขึ้น GitHub repo
2. ไปที่ https://vercel.com > Add New Project > เลือก repo นี้
3. ในหน้า Environment Variables ใส่ `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY`
   ตามค่าจริงของคุณ
4. กด Deploy — Vercel จะรัน `npm run build` และ serve โฟลเดอร์ `dist` ให้อัตโนมัติ
   (มีไฟล์ `vercel.json` เตรียมไว้ให้แล้วสำหรับ client-side routing)

## Deploy ขึ้น Netlify

1. Push โค้ดขึ้น GitHub เหมือนกัน
2. ไปที่ https://netlify.com > Add new site > Import an existing project
3. เลือก repo นี้ — Netlify จะอ่านค่า build command และ publish directory
   จากไฟล์ `netlify.toml` ที่เตรียมไว้ให้อัตโนมัติ
4. ไปที่ Site settings > Environment variables ใส่ `VITE_SUPABASE_URL`
   และ `VITE_SUPABASE_ANON_KEY`
5. กด Deploy site

## สิ่งที่ควรทำก่อนเปิดใช้งานสาธารณะจริง

โปรเจกต์นี้ใช้งานได้จริงและมีระบบเบื้องต้นสำหรับตรวจจับข้อความที่บ่งชี้
ภาวะวิกฤต (เช่น ความคิดทำร้ายตัวเอง) ซึ่งจะแสดงข้อมูลสายด่วน 1323 ให้ก่อนโพสต์
แต่ก่อนเปิดสาธารณะเต็มรูปแบบ แนะนำให้เพิ่มเติมดังนี้:

1. **ระบบกลั่นกรองเนื้อหาฝั่งเซิร์ฟเวอร์** — ตอนนี้กรองแค่ฝั่ง client
   ด้วย regex อย่างง่าย ควรเพิ่ม Supabase Edge Function ที่เรียก
   Moderation API ก่อนบันทึกจริงลงฐานข้อมูล เพื่อกรองเนื้อหาที่เป็นอันตราย
   ล่วงหน้ามากกว่านี้
2. **Rate limiting / กัน spam** — เพิ่ม Cloudflare Turnstile หรือ
   Supabase Edge Function ที่จำกัดจำนวนโพสต์ต่อ IP ต่อช่วงเวลา
3. **ระบบรายงานเนื้อหา (report/flag)** — ให้ผู้ใช้กดรายงานโพสต์ที่ไม่เหมาะสมได้
4. **หน้าแอดมินตรวจสอบเนื้อหา** — สำหรับลบโพสต์ที่ผิดกติกา
5. **ปรับ RLS policy ให้รัดกุมขึ้น** — ตอนนี้ `supabase_schema.sql` อนุญาตให้
   ทุกคนอัปเดตทุกคอลัมน์ของ stories ได้ (สำหรับปุ่มส่งกำลังใจ) ควรเปลี่ยนเป็น
   Postgres function ที่เพิ่มค่า hearts ทีละ 1 เท่านั้น ป้องกันการแก้ไขเนื้อหาคนอื่น
6. **นโยบายความเป็นส่วนตัวและข้อกำหนดการใช้งาน** — จำเป็นทางกฎหมาย
   โดยเฉพาะเมื่อเปิดให้ผู้เยาว์เข้าถึงได้
