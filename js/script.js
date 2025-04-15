const CITY_ID = '0816'; // Palembang
const API_URL = `https://api.myquran.com/v2/sholat/jadwal/${CITY_ID}`;
let currentNextPrayer = '';
let countdownInterval;

// Prayer icons mapping
const prayerIcons = {
    'imsak': 'fa-mug-hot',
    'subuh': 'fa-sun',
    'terbit': 'fa-sunrise',
    'dzuhur': 'fa-sun',
    'ashar': 'fa-sun',
    'maghrib': 'fa-sunset',
    'isya': 'fa-moon'
};

// Prayer labels in Indonesian
const prayerLabels = {
    'imsak': 'Waktu Imsak',
    'subuh': 'Sholat Subuh',
    'terbit': 'Matahari Terbit',
    'dzuhur': 'Sholat Dzuhur',
    'ashar': 'Sholat Ashar',
    'maghrib': 'Sholat Maghrib',
    'isya': 'Sholat Isya'
};

// Immediately display UI and fetch data
document.getElementById('prayer-container').style.display = '';
fetchPrayerTimes();

async function fetchPrayerTimes() {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayDate = `${year}-${month}-${day}`;

        const response = await fetch(`${API_URL}/${year}/${month}`);
        const data = await response.json();

        // console.log("Data Jadwal API:", data); // Debugging

        if (data.status) {
            const todayData = data.data.jadwal.find(j => j.date === todayDate);
            // console.log("Data Jadwal Hari Ini:", todayData); // Debugging

            if (todayData) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                document.getElementById('current-date').textContent = new Intl.DateTimeFormat('id-ID', options).format(today);

                displayPrayerTimes(todayData);
                startCountdown(todayData);
            } else {
                console.error("❌ Data jadwal hari ini tidak ditemukan!");
                document.getElementById('next-prayer-countdown').textContent = "Jadwal sholat hari ini tidak tersedia.";
            }

            displayMonthlySchedule(data.data.jadwal, day);
        }
    } catch (error) {
        // console.error("Gagal mengambil data:", error);
        document.getElementById('next-prayer-countdown').textContent = "Tidak dapat memuat data jadwal sholat.";
    }
}


function displayPrayerTimes(prayerTimes) {
    const container = document.getElementById('prayer-times-container');
    container.innerHTML = '';

    const prayers = ['imsak', 'subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    const nextPrayerName = getNextPrayer(prayerTimes).name;

    prayers.forEach(prayer => {
        const prayerTime = prayerTimes[prayer];
        const isNext = prayer === nextPrayerName;
        const icon = prayerIcons[prayer] || 'fa-clock';

        const card = `
            <div class="col-md-6 col-lg-3">
                <div class="prayer-card ${isNext ? 'next' : ''}">
                    <div class="prayer-header">
                        <i class="fas ${icon} prayer-icon"></i>
                        <h5 class="prayer-name">${prayer.charAt(0).toUpperCase() + prayer.slice(1)}</h5>
                    </div>
                    <div class="prayer-content">
                        <p class="prayer-label">${prayerLabels[prayer]}</p>
                        <p class="prayer-time">${prayerTime}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function displayMonthlySchedule(jadwal, currentDay) {
    const tableBody = document.getElementById('monthly-data');
    tableBody.innerHTML = '';

    jadwal.forEach(day => {
        const isToday = day.tanggal.endsWith(currentDay);
        const row = `
            <tr class="${isToday ? 'current-day' : ''}">
                <td>${day.tanggal}${isToday ? ' <span class="current-badge">Hari ini</span>' : ''}</td>
                <td>${day.imsak}</td>
                <td>${day.subuh}</td>
                <td>${day.terbit}</td>
                <td>${day.dzuhur}</td>
                <td>${day.ashar}</td>
                <td>${day.maghrib}</td>
                <td>${day.isya}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function getNextPrayer(prayerTimes) {
    const prayers = ['imsak', 'subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    const now = new Date();

    let nextPrayer = null;
    let nextPrayerTime = null;

    for (let prayer of prayers) {
        if (!prayerTimes[prayer]) {
            // console.warn(`Waktu sholat '${prayer}' tidak ditemukan di API!`);
            continue; // Skip jika tidak ada data
        }

        // Konversi waktu sholat ke format Date
        const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
        const prayerDateTime = new Date(now);
        prayerDateTime.setHours(hours, minutes, 0, 0);

        // Cari waktu sholat yang lebih besar dari waktu saat ini
        if (prayerDateTime > now) {
            nextPrayer = prayer;
            nextPrayerTime = prayerDateTime;
            break;
        }
    }

    // Jika semua waktu sholat sudah lewat, set ke waktu Imsak besok
    if (!nextPrayer) {
        nextPrayer = 'imsak';
        if (prayerTimes.imsak) {
            const [hours, minutes] = prayerTimes.imsak.split(':').map(Number);
            nextPrayerTime = new Date(now);
            nextPrayerTime.setDate(now.getDate() + 1);
            nextPrayerTime.setHours(hours, minutes, 0, 0);
        } else {
            // console.error("Waktu Imsak tidak ditemukan dalam API!");
            return null;
        }
    }

    const result = {
        name: nextPrayer,
        time: nextPrayerTime,
        label: prayerLabels[nextPrayer],
    };

    // console.log("Waktu sholat berikutnya:", result); // Debugging
    return result;
}

const now = new Date();
startCountdown(now.toLocaleString());


function updateCountdown(nextPrayer) {
    const now = new Date();
    const diff = nextPrayer.time - now;

    if (diff <= 0) {
        fetchPrayerTimes();
        return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('next-prayer-countdown').innerHTML =
        `<i class="fas fa-clock me-2"></i> <span class="time-digits">${hours.toString().padStart(2, '0')}:
${minutes.toString().padStart(2, '0')}:
${seconds.toString().padStart(2, '0')}</span> menuju <strong>${nextPrayer.label}</strong>`;
}


function startCountdown(prayerTimes) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    let nextPrayer = getNextPrayer(prayerTimes);
    currentNextPrayer = nextPrayer.name;
    updateCountdown(nextPrayer);

    countdownInterval = setInterval(() => {
        const newNextPrayer = getNextPrayer(prayerTimes);

        if (currentNextPrayer !== newNextPrayer.name) {
            currentNextPrayer = newNextPrayer.name;
            displayPrayerTimes(prayerTimes);
        }

        updateCountdown(newNextPrayer);
    }, 1000);
}



// Initialize
fetchPrayerTimes();