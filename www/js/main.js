//Cek compatibility browser dalam menangani websql
if (window.openDatabase) {
    //Membuat database, parameter: 1. nama database, 2.versi db, 3. deskripsi 4. ukuran database (dalam bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("biodata", "0.1", "biodata peserta workshop", 1024 * 1024);

    //membuat tabel person dengan SQL untuk database menggunakan function transaction
    mydb.transaction(t => {
        t.executeSql("CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY ASC, nama TEXT, alamat TEXT)");
    });
} else {
    alert("WebSQL tidak didukung oleh browser ini!");
}

function show_data() {
    if (mydb) {
        mydb.transaction(t => {
            t.executeSql("SELECT * FROM person", [], update_list);
        });
    } else {
        alert("database tidak ditemukan")
    }
}

function update_list(transaction, results) {
    var listholder = document.getElementById("list_data");
    var i;

    listholder.innerHTML = "";

    for (i = 0; i < (results.rows.length); i++) {
        var row = results.rows.item(i);

        listholder.innerHTML +=
            `<tr>
            <td>${row.nama}</td>
            <td>${row.alamat}</td>
            <td><a href="javascript:void(0);" onclick="edit_data(${row.id});">Update</a> | <a href="javascript:void(0);" onclick="hapus_data(${row.id});">Hapus</a></td>
            </tr>`;
    }
}

//function untuk input data ke database
function tambah_data() {
    if (mydb) {
        var input_nama = document.getElementById("nama").value;
        var input_alamat = document.getElementById("alamat").value;

        if (input_nama !== "" && input_alamat !== "") {
            mydb.transaction(t => {
                t.executeSql("INSERT INTO person(nama,alamat) VALUES (?,?)", [input_nama, input_alamat]);
            });
        } else {
            alert("nama dan alamat harus diisi");
        }
    }
}

function hapus_data(id) {
    if (mydb) {
        mydb.transaction(t => {
            t.executeSql("DELETE FROM person WHERE id = ?", [id], show_data);
        });
    } else {
        alert("database tidak ditemukan");
    }
}

function edit_data(id) {
    if (mydb) {
        mydb.transaction(t => {
            var formholder = document.getElementById("form_data");
            formholder.innerHTML = "";

            t.executeSql("SELECT * FROM person WHERE id = ?", [id], function(tx, results) {
                formholder.innerHTML =
                    `<form>
                        <input type="hidden" id="id_edit" value="${id}">
                        <div class="form-group">
                            <label>Nama</label>
                            <input type="text" class="form-control" id="nama_edit" value="${results.rows.item(0).nama}">
                        </div>
                        <div class="form-group">
                            <label>Alamat</label>
                            <input type="text" class="form-control" id="alamat_edit" value="${results.rows.item(0).alamat}">
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-warning" onclick="update_data();">Update</button>
                            <button type="reset" class="btn btn-danger" onclick="location.reload();">Batal</button>
                        </div>
                    </form>`
            });
        });
    } else {
        alert("database tidak ditemukan");
    }
}

function update_data() {
    if (mydb) {
        var edit_id = document.getElementById("id_edit").value;
        var edit_nama = document.getElementById("nama_edit").value;
        var edit_alamat = document.getElementById("alamat_edit").value;

        if (edit_nama !== "" && edit_alamat !== "") {
            mydb.transaction(t => {
                t.executeSql("UPDATE person SET nama=?, alamat=? WHERE id=?", [edit_nama, edit_alamat, edit_id]);
            });
        } else {
            alert("nama dan alamat harus diisi");
        }
    } else {
        alert("database tidak ditemukan");
    }
}

show_data();