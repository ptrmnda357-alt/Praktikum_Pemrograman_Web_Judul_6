/**
 * Praktikum 6: Komunikasi Data Asinkron Menggunakan AJAX & Fetch API
 * Sistem Informasi Data Mahasiswa (SIMA) - Waktu Praktikum: 90 Menit
 */

//Deklarasikan endpoint API 
const API_URL = 'api/mahasiswa.php';

// 1. Seleksi Elemen DOM Utama
const tabelBody = document.getElementById('tabel-body-mahasiswa');
const inputSearch = document.getElementById('input-search');
const totalBadge = document.getElementById('total-mahasiswa-badge');
const totalInfo = document.getElementById('total-mahasiswa-info');
const formTambah = document.getElementById('form-tambah-mahasiswa');
const alertBox = document.getElementById('alert-box');

// Helper: Menampilkan Pesan Notifikasi Dinamis
function showAlert(message, type = 'success') {
   if (!alertBox) return;
   alertBox.textContent = message;
   alertBox.className = `alert-box alert-${type}`;
   alertBox.style.display = 'block';
   setTimeout(() => {
    alertBox.style.display = 'none';
   }, 4000);
}

// 2. Fetch API GET: Mengambil Data Mahasiswa dari Server
async function loadMahasiswa(keyword = '') {

    // tampilkan indikator loading
    tabelBody.innerHTML = `
    <tr>
    <td colspan="8" style="text-align: center; padding:
    20px; color: var(--text-muted);">
    Memuat data dari server...
    </td>
    </tr>
    `;

    try {

        //Percobaan 6-1 Langkah 4 susun url request
        const url = keyword ?
        `${API_URL}?search=${encodeURLComponent(keyword)}` : API_URL;
        
        //Percobaan 6-1 Langkah 4 kirim request
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error:
            ${response.status}`);

        //Percobaan 6-1 Langkah 4 kirim ekstrak json 
        const result = await response.json();
        if (result.status === 'success') {
            renderTable(result.data, keyword);
        } else {
            showAlert(result.message, 'danger');
        }
      
    } catch (error) {
        tabelBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #ef4444;">
                    Gagal memuat data dari REST API: ${error.message}
                </td>
            </tr>
        `;
    }
}

// 3. Render Baris Tabel Dinamis ke DOM
function renderTable(mahasiswaList = [], keyword = '') {
    tabelBody.innerHTML = '';

    if (totalBadge) totalBadge.textContent = mahasiswaList.length;
    if (totalInfo) {
        totalInfo.textContent = keyword 
            ? `Ditemukan ${mahasiswaList.length} mahasiswa untuk "${keyword}"`
            : `Menampilkan ${mahasiswaList.length} mahasiswa`;
    }

    if (mahasiswaList.length === 0) {
        tabelBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: var(--text-muted);">
                    Tidak ada data mahasiswa yang cocok.
                </td>
            </tr>
        `;
        return;
    }

    mahasiswaList.forEach((mhs, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="img/avatar-default.svg" alt="Foto ${mhs.nama}" class="avatar-img" width="36" height="36">
            </td>
            <td><strong>${mhs.npm}</strong></td>
            <td>${mhs.nama}</td>
            <td><span class="badge">${mhs.program_studi}</span></td>
            <td>${mhs.angkatan}</td>
            <td><a href="mailto:${mhs.email}" class="link-email">${mhs.email}</a></td>
            <td>
                <button type="button" class="btn btn-warning btn-sm" onclick="openEditModal(${mhs.id})">Edit</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteMahasiswa(${mhs.id}, '${mhs.nama}')">Hapus</button>
            </td>
        `;
        tabelBody.appendChild(tr);
    });
}

// Elemen DOM Modal Edit
const modalEdit = document.getElementById('modal-edit');
const formEdit = document.getElementById('form-edit-mahasiswa');
const editId = document.getElementById('edit-id');
const editnpm = document.getElementById('edit-npm');
const editNama = document.getElementById('edit-nama');
const editProdi = document.getElementById('edit-prodi');
const editAngkatan = document.getElementById('edit-angkatan');
const editEmail = document.getElementById('edit-email');