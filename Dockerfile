FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ⭐ เพิ่มบรรทัดนี้เพื่อให้ Prisma สร้าง Client ขึ้นมาก่อนการ Build
RUN npx prisma generate

# แล้วค่อยรัน Build แอปพลิเคชัน
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]