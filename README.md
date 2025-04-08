# เกม XO

## 📌 คุณสมบัติ
- เล่นกับเพื่อน (Player vs Player) หรือกับ AI Bot (Player vs Computer)
- กำหนดขนาดกระดานได้ตั้งแต่ 3x3 ถึง 10x10
- บันทึกประวัติการเล่นลงในฐานข้อมูล MongoDB
- มีระบบดูประวัติการเล่นย้อนหลัง
- UI สวยงามและใช้งานง่าย

## 🚀 การติดตั้งและใช้งาน

### 1. คัดลอกโปรเจกต์จาก GitHub
```sh
git clone [your-repository-url]
cd xo-game
```

### 2. ติดตั้ง Dependencies
```sh
# ติดตั้ง backend dependencies
cd backend
npm install

# ติดตั้ง frontend dependencies
cd ../frontend
npm install
```

### 3. ตั้งค่า MongoDB
- ติดตั้ง MongoDB บนเครื่องของคุณ
- เริ่มการทำงานของ MongoDB
- ใช้ค่าเริ่มต้น: mongodb://localhost:27017

### 4. รันโปรเจกต์
```sh
# รัน backend server
cd backend
npm start

# รัน frontend server (เปิด terminal อีกหน้าต่าง)
cd frontend
npm start
```

### 5. เปิดใช้งาน
เปิดเบราว์เซอร์และไปที่:
```
http://localhost:3000
```

## 🎮 วิธีการเล่น
1. เลือกโหมดการเล่น: **ผู้เล่น vs ผู้เล่น** หรือ **ผู้เล่น vs AI**
2. เลือกขนาดกระดานที่ต้องการ
3. คลิกที่ช่องเพื่อเดินหมาก
4. AI จะเดินอัตโนมัติตามอัลกอริธึม Minimax
5. เกมจบเมื่อมีผู้ชนะหรือกระดานเต็ม

## 🏗️ การออกแบบระบบ

### โครงสร้างโปรเจกต์
- `Home.js` - หน้าแรกสำหรับเลือกโหมดการเล่นและขนาดกระดาน
- `Game.js` - จัดการการเล่นเกมและแสดงผลกระดาน
- `History.js` - แสดงประวัติการเล่นเกม
- `AIBot.js` - อัลกอริธึม AI สำหรับการเล่นกับ Bot
- `server.js` - Backend server และการเชื่อมต่อ MongoDB
- `models/Game.js` - โครงสร้างข้อมูลเกมใน MongoDB
- `routes/games.js` - API endpoints สำหรับการจัดการเกม

### ลำดับการทำงานของเกม
1. ผู้ใช้เลือกโหมดการเล่นและขนาดกระดาน
2. ระบบสร้างเกมใหม่และบันทึกลงฐานข้อมูล
3. ผู้เล่นและ Bot สลับกันเดินหมาก
4. Bot คำนวณการเดินหมากโดยใช้ Minimax Algorithm
5. ระบบตรวจสอบผู้ชนะหลังจากทุกการเดินหมาก
6. เมื่อเกมจบ ประวัติการเล่นจะถูกบันทึกลง MongoDB

## 🤖 อัลกอริธึม AI: Minimax

### หลักการทำงาน
AI ใช้ **Minimax Algorithm** เพื่อเลือกการเดินหมากที่ดีที่สุด โดยพิจารณาจากคะแนนของแต่ละทางเลือก:
- **+10** ถ้า Bot (`O`) ชนะ
- **-10** ถ้าผู้เล่น (`X`) ชนะ
- **0** ถ้าเสมอ

### ขั้นตอนการทำงาน
1. **ตรวจสอบผู้ชนะ**: หากมีผู้ชนะให้คืนค่าคะแนนตามที่กำหนด
2. **จำลองการเดินหมากทั้งหมด**: ลองวาง `X` หรือ `O` ในช่องว่าง
3. **คำนวณคะแนนของแต่ละทางเลือก**: ใช้ฟังก์ชัน Minimax คำนวณคะแนน
4. **เลือกทางเลือกที่ดีที่สุด**: Bot เลือกการเดินหมากที่ได้คะแนนสูงสุด

ตัวอย่างโค้ด:
```javascript
minimax(board, depth, isMaximizing) {
  const winner = this.checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (winner === 'draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === null) {
          board[i][j] = 'O';
          const score = this.minimax(board, depth + 1, false);
          board[i][j] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === null) {
          board[i][j] = 'X';
          const score = this.minimax(board, depth + 1, true);
          board[i][j] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}
```

### การเพิ่มประสิทธิภาพ
เพื่อป้องกันปัญหาการคำนวณช้า AI ใช้วิธีดังนี้:
- จำกัด **ความลึกของการค้นหา** ตามขนาดกระดาน
- ให้ความสำคัญกับ **การชนะเร็วที่สุด** โดยการลบ depth ออกจากคะแนน

## 📊 API Endpoints
- `POST /api/games` - สร้างเกมใหม่
- `GET /api/games` - ดึงประวัติเกมทั้งหมด
- `GET /api/games/:id` - ดึงข้อมูลเกมเฉพาะ
- `POST /api/games/:id/move` - ทำการเดินหมาก

## 🔮 แนวทางการพัฒนาต่อ
1. เพิ่มระดับความยากของ AI
2. เพิ่มระบบเล่นแบบ Real-time Multiplayer
3. เพิ่มระบบ Authentication
4. เพิ่มสถิติการเล่นและ Leaderboard
5. เพิ่มระบบ Replay แบบละเอียด 