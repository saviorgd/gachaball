
## custom tab


### filed "Max number"
ค่าเริ่มต้นคือ 9

### filed "จำนวนลูก"
ใน Custom tab เปลี่ยนชื่อ field จาก "จำนวนลูก" เป็น "Number of Draws"
ให้จำกัดจำนวนตัวเลขนี้ไม่เกิน 30
ค่าเริ่มต้นคือ 6 

เพิ่มปุ่ม + และปุ่ม - ข้างขวาของ input box 
เมื่อกด + ให้เพิ่มจำนวนขึ้น 1
เมื่อกด - ให้ลดจำนวนลง 1

ใต้ input box ให้เพิ่มปุ่มที่เรียงกันไปทางขวาเรื่อยๆดังนี้
ปุ่ม "1" กดแล้ว ค่าใน "Number of Draws" เปลี่ยนเป็น 1
ปุ่ม "2" กดแล้ว ค่าใน "Number of Draws" เปลี่ยนเป็น 2
ปุ่ม "3" กดแล้ว ค่าใน "Number of Draws" เปลี่ยนเป็น 3
ปุ่ม "6" กดแล้ว ค่าใน "Number of Draws" เปลี่ยนเป็น 6

ต้องออกแบบให้ ui เข้าใจได้ว่าเรื่องเหล่านี้เกี่ยวข้องกับ "Number of Draws" เช่นอยู่ใกล้ๆกัน หรือ ขนาดปุ่มต้องเหมาะสม

### เปลี่ยนรายละเอียด UI ของ Repeat mode
Repeat mode: pill toggle 2 ตัวเลือก (No Repeat / Allow Repeat)
เปลี่ยนเป็น
ชื่อ field จาก Repeat mode เป็น Duplicates
แล้วแสดงเป็น radio box สองอันนี้แทน pill toggle
○ No Duplicates 
○ Allow Duplicates
ตัว No Duplicates คือ No Repeat เดิม
ตัว Allow Duplicates คือ Allow Repeat เดิม
ซึ่งค่าเริ่มต้นต้องเป็น Allow Duplicates 