//Navbar-fixed//
window.onscroll = function () {
  const header = document.querySelector("header");
  const fixedNav = header.offsetTop;
  const toTop = document.querySelector("#to-top");

  if (window.pageYOffset > fixedNav) {
    header.classList.add("navbar-fixed");
    toTop.classList.remove("hidden");
    toTop.classList.remove("flex");
  } else {
    header.classList.remove("navbar-fixed");
    toTop.classList.remove("flex");
    toTop.classList.remove("hidden");
  }
};

//hamberger-line//
const hamberger = document.querySelector("#hamberger");
const navMenu = document.querySelector("#nav-menu");

hamberger.addEventListener("click", function () {
  hamberger.classList.toggle("hamberger-active");
  navMenu.classList.toggle("hidden");
});

// klik diluar hamberger
window.addEventListener("click", function (e) {
  if (e.target != hamberger && e.target != navMenu) {
    hamberger.classList.remove("hamberger-active");
    navMenu.classList.add("hidden");
  }
});

// dark mode toggle
const darkToggle = document.querySelector("#dark-toggle");
const svg = document.getElementsByClassName("svg-none");
const html = document.querySelector("html");

darkToggle.addEventListener("click", function () {
  if (darkToggle.checked) {
    html.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    html.classList.remove("dark");
    localStorage.theme = "light";
    svg.classList.remove("svg-none");
  }
});

// pindahkan posisi toggle sesuai mode
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  darkToggle.checked = true;
} else {
  darkToggle.checked = false;
}

const arr = ["I am Adam"];
let karakterIndex = 0;
let munculDelay = 100;
const berjalan = document.getElementById("berjalan");

function teksBerjalan() {
  if (karakterIndex < arr[0].length) {
    berjalan.innerHTML += arr[0].charAt(karakterIndex);
    karakterIndex++;
    setTimeout(teksBerjalan, munculDelay);
  } else {
    setTimeout(hapusTeks, 300);
  }
}

function hapusTeks() {
  if (karakterIndex > 0) {
    let teks = arr[0].substring(0, karakterIndex - 1);
    berjalan.innerHTML = teks;
    karakterIndex--;
    setTimeout(hapusTeks, 50);
  } else {
    karakterIndex = 0;
    setTimeout(teksBerjalan, 100);
  }
}
teksBerjalan();

// *membuat message indexdb*//
//Database
// Fungsi untuk membuka IndexedDB dan menginisialisasi object store
function openDatabase() {
  const request = indexedDB.open("contactMessagesDB", 1);

  // Inisialisasi atau upgrade database
  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Jika object store "messages" belum ada, buatlah
    if (!db.objectStoreNames.contains("messages")) {
      const objectStore = db.createObjectStore("messages", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Buat index untuk field-field yang akan digunakan
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("email", "email", { unique: false });
      objectStore.createIndex("subject", "subject", { unique: false });
      objectStore.createIndex("message", "message", { unique: false });
    }
  };

  // Menangani sukses membuka database
  request.onsuccess = function (event) {
    console.log("Database initialized successfully");
  };

  // Menangani error saat membuka database
  request.onerror = function (event) {
    console.error("Database error: ", event.target.error);
  };
}

// Fungsi untuk menyimpan pesan
function saveMessage(name, email, subject, message) {
  const request = indexedDB.open("contactMessagesDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("messages", "readwrite");
    const objectStore = transaction.objectStore("messages");

    // Membuat objek baru untuk pesan
    const newMessage = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    const addRequest = objectStore.add(newMessage);

    // Menangani sukses saat pesan disimpan
    addRequest.onsuccess = function () {
      console.log("Message saved successfully");
      alert("Pesan Anda telah terkirim!");
    };

    // Menangani error saat menyimpan pesan
    addRequest.onerror = function (event) {
      console.error("Error saving message: ", event.target.error);
      alert("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    };
  };

  request.onerror = function (event) {
    console.error("Database error: ", event.target.error);
  };
}

// Fungsi untuk mengambil semua pesan
function getMessages(callback) {
  const request = indexedDB.open("contactMessagesDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("messages", "readonly");
    const objectStore = transaction.objectStore("messages");

    const getRequest = objectStore.getAll();

    // Menangani sukses saat mengambil data pesan
    getRequest.onsuccess = function () {
      const messages = getRequest.result;
      callback(messages);
    };

    // Menangani error saat mengambil data
    getRequest.onerror = function (event) {
      console.error("Error retrieving messages: ", event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error("Database error: ", event.target.error);
  };
}

// Event listener untuk form kontak
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Mengambil nilai dari form
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Menyimpan pesan ke IndexedDB
  saveMessage(name, email, subject, message);

  // Reset form setelah pengiriman
  contactForm.reset();
});

// Panggil fungsi untuk membuka database saat halaman dimuat
openDatabase();
