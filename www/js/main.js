//Cek compatibility browser dalam menangani websql
if (window.openDatabase) {
    //Membuat database, parameter: 1. nama database, 2.versi db, 3. deskripsi 4. ukuran database (dalam bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("RuangFSM", "0.1", "daftar ruangan FSM", 1024 * 1024);

    //membuat tabel person dengan SQL untuk database menggunakan function transaction
    mydb.transaction(t => {
        t.executeSql("CREATE TABLE IF NOT EXISTS fsm_room (id INTEGER PRIMARY KEY ASC, nama_ruang TEXT, kapasitas TEXT)");
    });
} else {
    alert("WebSQL tidak didukung oleh browser ini!");
}

function show_data() {
    if (mydb) {
        mydb.transaction(t => {
            t.executeSql("SELECT * FROM fsm_room", [], update_list);
        });
    } else {
        alert("database tidak ditemukan")
    }
}

function empty() {
    document.getElementById("nama_ruang").value = "";
    document.getElementById("kapasitas").value = "";
}

function update_list(transaction, results) {
    var listholder = document.getElementById("list_data");
    var i;

    listholder.innerHTML = "";

    for (i = 0; i < (results.rows.length); i++) {
        var row = results.rows.item(i);

        listholder.innerHTML +=
            `<tr>
            <td class="text-center">${row.nama_ruang}</td>
            <td class="text-center">${row.kapasitas}</td>
            <td class="text-center"><a href="javascript:void(0);" class="btn btn-warning btn-sm" onclick="edit_data(${row.id});" data-toggle="modal" data-target="#exampleModal1"><i class="fa fa-pencil" aria-hidden="true"></i></a> 
            <a href="javascript:void(0);" class="btn btn-danger btn-sm" onclick="hapus_data(${row.id});"><i class="fa-solid fa-trash"></i></a></td>
            </tr>`;
    }
}

//function untuk input data ke database
function tambah_data() {
    if (mydb) {
        var input_nama = document.getElementById("nama_ruang").value;
        var input_alamat = document.getElementById("kapasitas").value;

        if (input_nama !== "" && input_alamat !== "") {
            mydb.transaction(t => {
                t.executeSql("INSERT INTO fsm_room(nama_ruang,kapasitas) VALUES (?,?)", [input_nama, input_alamat]);
            });
            $('#exampleModal').modal('hide');
            sukses_tambah();
            show_data();
        } else {
            alert("nama ruang dan kapasitas harus diisi");
        }
    }
}

function hapus_data(id) {
    if (mydb) {
        mydb.transaction(t => {
            t.executeSql("DELETE FROM fsm_room WHERE id = ?", [id], show_data);
        });
        sukses_hapus();
    } else {
        alert("database tidak ditemukan");
    }
}

function edit_data(id) {
    if (mydb) {
        mydb.transaction(t => {
            var formholder = document.getElementById("form_data1");
            formholder.innerHTML = "";

            t.executeSql("SELECT * FROM fsm_room WHERE id = ?", [id], function(tx, results) {
                formholder.innerHTML =
                    `<form>
                        <input type="hidden" id="id_edit" value="${id}">
                        <div class="form-group">
                            <label>Nama Ruang</label>
                            <input type="text" class="form-control" id="nama_edit" value="${results.rows.item(0).nama_ruang}">
                        </div>
                        <div class="form-group">
                            <label>Kapasitas</label>
                            <input type="text" class="form-control" id="kapasitas_edit" value="${results.rows.item(0).kapasitas}">
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
        var edit_kapasitas = document.getElementById("kapasitas_edit").value;

        if (edit_nama !== "" && edit_kapasitas !== "") {
            mydb.transaction(t => {
                t.executeSql("UPDATE fsm_room SET nama_ruang=?, kapasitas=? WHERE id=?", [edit_nama, edit_kapasitas, edit_id]);
            });
            $('#exampleModal1').modal('hide');
            sukses_edit();
            show_data();
        } else {
            alert("nama ruang dan kapasitas harus diisi");
        }
    } else {
        alert("database tidak ditemukan");
    }
}

function sukses_tambah() {

    swal({

        title: "Berhasil!",

        text: "Ruangan berhasil ditambahkan",

        icon: "success",

        timer: 2000,

        button: false

    });

}

function sukses_edit() {

    swal({

        title: "Berhasil!",

        text: "Ruangan berhasil diperbarui",

        icon: "success",

        timer: 2000,

        button: false

    });

}

function sukses_hapus() {

    swal({

        title: "Berhasil!",

        text: "Ruangan berhasil dihapus",

        icon: "success",

        timer: 2000,

        button: false

    });

}

show_data();