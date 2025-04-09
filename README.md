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
AI ของเราใช้ Minimax Algorithm ที่ปรับปรุงให้รองรับกระดานขนาดใหญ่ โดยมีหลักการทำงานดังนี้:

1. **การประเมินสถานะ**:
   - ชนะ: +10
   - แพ้: -10
   - เสมอ: 0
   - คำนึงถึงความลึกของการค้นหา (depth) เพื่อให้เลือกการชนะที่เร็วที่สุด

2. **การค้นหาการเดินที่ดีที่สุด**:
   - สร้างต้นไม้ของความเป็นไปได้ทั้งหมด
   - คำนวณคะแนนของแต่ละทางเลือก
   - เลือกทางเลือกที่ได้คะแนนสูงสุด

### การปรับปรุงประสิทธิภาพ
1. **การตรวจสอบผู้ชนะแบบอัจฉริยะ**:
   ```javascript
   checkWinner(board) {
     // ตรวจสอบแนวตั้ง
     for (let col = 0; col < this.boardSize; col++) {
       let row = 0;
       while (row < this.boardSize && board[row][col] === board[0][col] && board[row][col] !== null) {
         row++;
       }
       if (row === this.boardSize) return board[0][col];
     }

     // ตรวจสอบแนวนอน
     for (let row = 0; row < this.boardSize; row++) {
       let col = 0;
       while (col < this.boardSize && board[row][col] === board[row][0] && board[row][col] !== null) {
         col++;
       }
       if (col === this.boardSize) return board[row][0];
     }

     // ตรวจสอบแนวทแยง
     let diagonal1 = true;
     let diagonal2 = true;
     for (let i = 0; i < this.boardSize; i++) {
       if (board[i][i] !== board[0][0] || board[i][i] === null) diagonal1 = false;
       if (board[i][this.boardSize - 1 - i] !== board[0][this.boardSize - 1] || board[i][this.boardSize - 1 - i] === null) diagonal2 = false;
     }
     if (diagonal1) return board[0][0];
     if (diagonal2) return board[0][this.boardSize - 1];

     return null;
   }
   ```

2. **การคำนวณการเดินที่ดีที่สุด**:
   ```javascript
   findBestMove(board) {
     let bestScore = -Infinity;
     let bestMove = { row: -1, col: -1 };

     for (let i = 0; i < this.boardSize; i++) {
       for (let j = 0; j < this.boardSize; j++) {
         if (board[i][j] === null) {
           board[i][j] = 'O';
           const score = this.minimax(board, 0, false);
           board[i][j] = null;
           if (score > bestScore) {
             bestScore = score;
             bestMove = { row: i, col: j };
           }
         }
       }
     }

     return bestMove;
   }
   ```

3. **การปรับปรุงประสิทธิภาพ**:
   - ใช้ depth-based scoring เพื่อให้ AI เลือกการชนะที่เร็วที่สุด
   - รองรับกระดานขนาดใหญ่ได้อย่างมีประสิทธิภาพ
   - มีการตรวจสอบเงื่อนไขการชนะที่รวดเร็ว

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