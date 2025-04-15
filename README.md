# Jadwal Sholat Palembang 🌺

Website sederhana yang menampilkan **jadwal sholat harian** khusus untuk wilayah **Palembang**, menggunakan API dari [myquran.com](https://api.myquran.com/v2/).

🔗 **Live Demo**: [https://jadwalsholatpalembang.netlify.app](https://jadwalsholatpalembang.netlify.app)

## 📌 Fitur

- Menampilkan jadwal sholat: Subuh, Dzuhur, Ashar, Maghrib, Isya  
- Tanggal otomatis berdasarkan hari ini  
- Lokasi tetap: **Palembang (ID: 1601)**  
- Tampilan responsive dengan **Bootstrap 4**  
- Sumber data terpercaya dari API [myquran.com](https://api.myquran.com/v2/)

## 🛠 Teknologi yang Digunakan

- HTML5  
- CSS3  
- JavaScript  
- Bootstrap 4  
- [API Jadwal Sholat](https://api.myquran.com/v2/)

## 📂 Struktur Folder

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── (ikon/gambar jika ada)
```

## 🚀 Cara Menjalankan Secara Lokal

1. Clone repository:

```bash
git clone https://github.com/fahruladib9/jadwal-sholat-palembang.git
cd jadwal-sholat-palembang
```

2. Jalankan file `index.html` di browser (klik dua kali atau pakai Live Server).

## 📦 API yang Digunakan

Data jadwal diambil dari endpoint:

```
GET https://api.myquran.com/v2/sholat/jadwal/kota/1601/tanggal/yyyy-mm-dd
```

> 1601 = ID Kota Palembang

## 🤝 Kontribusi

Pull request terbuka lebar untuk siapa saja yang ingin bantu mengembangkan tampilan atau menambah fitur seperti:

- Jadwal mingguan/bulanan  
- Lokasi dinamis  
- Pengingat waktu sholat  

---

✨ Dibuat oleh [Fahrul Adib](https://github.com/fahruladib9) | 📧 fahruladib9@gmail.com

