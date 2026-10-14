# Keputusan teknis

- React/TypeScript/Vite dipilih untuk komposisi interaksi dan build statis; materi tetap CSS/JavaScript tanpa framework.
- Organisasi per fitur/game membuat perubahan lokal. Validator pure menerima snapshot, bukan mengakses UI.
- CodeMirror dimuat ketika editor dibutuhkan. HTML arena tetap; versi pertama tidak menjalankan DOM JavaScript bebas.
- State Quest menggunakan reducer sinkron `nextState(state,event)` dengan kejadian asynchronous disimulasikan oleh host. Ini memperlihatkan race condition tanpa permintaan layanan nyata.
- Semua game terbuka; progres lokal tanpa identitas. Penyelesaian tidak hilang saat reset draft.
- GitHub/Cloudflare saja. Monitoring menangkap synthetic browser errors dan status deployment, bukan seluruh error pengunjung.
- Integrasi portfolio mempertahankan top-up. Hosting playground terpisah dan Git-integrated; hosting portfolio tetap seperti sebelumnya.
