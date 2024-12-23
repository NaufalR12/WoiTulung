import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# Koneksi ke database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",  # Ganti dengan password MySQL-mu
    database="woitulung"
)

def get_db_connection():
    global db
    try:
        if db.is_connected():
            return db
        else:
            db.ping(reconnect=True, attempts=3, delay=5)
            return db
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",  # Ganti dengan password MySQL-mu
            database="woitulung"
        )
        return db

# Fungsi untuk mengubah BLOB menjadi Base64
def convert_blob_to_base64(blob):
    return base64.b64encode(blob).decode('utf-8')

# Fungsi untuk menghapus atau mengonversi semua kolom bytes dalam user
def sanitize_user(user):
    for key in user:
        if isinstance(user[key], (bytes, bytearray)):
            user[key] = convert_blob_to_base64(user[key])
    return user

# Fungsi untuk mengonversi timedelta menjadi string
def convert_timedelta_to_string(obj):
    if isinstance(obj, timedelta):
        return str(obj)
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

# Endpoint Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password:
        return jsonify({"message": "Email dan password wajib diisi"}), 400
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s AND role=%s", (email, role))
    user = cursor.fetchone()
    cursor.close()

    if user and user['password'] == password:  # Cek password tanpa bcrypt
        user = sanitize_user(user)
        user['complete'] = all([user.get('nama'), user.get('no_hp'), user.get('alamat')])
        return jsonify({"message": "Login berhasil", "user": user}), 200
    else:
        return jsonify({"message": "Email atau password salah"}), 401

# Endpoint untuk registrasi pengguna baru
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # Memeriksa apakah email, password, dan role sudah diisi
    if not email or not password or not role:
        return jsonify({"message": "Email, password, dan role wajib diisi"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    # Memeriksa apakah email sudah terdaftar
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"message": "Email sudah digunakan"}), 400

    # Menyimpan data pengguna baru ke database
    cursor.execute("""
        INSERT INTO users (email, password, role)
        VALUES (%s, %s, %s)
    """, (email, password, role))
    db.commit()
    cursor.close()
    
    return jsonify({"message": "Registrasi berhasil"}), 201


# Endpoint untuk mendapatkan semua layanan
@app.route('/services', methods=['GET'])
def get_services():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM services")
    services = cursor.fetchall()
    cursor.close()
    for service in services:
        service['gambar'] = convert_blob_to_base64(service['gambar'])
    return jsonify(services)

# Endpoint untuk mendapatkan layanan berdasarkan query
@app.route('/services/search', methods=['GET'])
def search_services():
    query = request.args.get('query')
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM services WHERE nama_layanan LIKE %s", ('%' + query + '%',))
    services = cursor.fetchall()
    cursor.close()
    for service in services:
        service['gambar'] = convert_blob_to_base64(service['gambar'])
    return jsonify(services)

# Endpoint untuk mendapatkan detail layanan berdasarkan service_id
@app.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM services WHERE service_id=%s", (service_id,))
    service = cursor.fetchone()
    cursor.close()
    if service:
        service['gambar'] = convert_blob_to_base64(service['gambar'])
        return jsonify(service)
    return jsonify({"message": "Service not found"}), 404

# Endpoint untuk mendapatkan detail pengguna berdasarkan user_id
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        user = sanitize_user(user)
        user['complete'] = all([user.get('nama'), user.get('no_hp'), user.get('alamat')])
        return jsonify(user)
    return jsonify({"message": "User not found"}), 404

# Endpoint untuk memperbarui data pengguna (profil)
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    db = get_db_connection()
    cursor = db.cursor()

    query = """
        UPDATE users SET nama=%s, no_hp=%s, email=%s, alamat=%s, gambar=%s WHERE user_id=%s
    """
    values = (data['nama'], data['no_hp'], data['email'], data['alamat'], base64.b64decode(data['gambar']) if data['gambar'] else None, user_id)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return jsonify({"message": "User updated successfully"})

# Endpoint untuk mengunggah gambar profil
@app.route('/upload_profile_image', methods=['POST'])
def upload_profile_image():
    data = request.json
    user_id = data.get('user_id')
    image_base64 = data.get('image')

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("UPDATE users SET gambar=%s WHERE user_id=%s", (base64.b64decode(image_base64), user_id))
    db.commit()
    cursor.close()

    return jsonify({"message": "Gambar profil berhasil diperbarui"})

# Endpoint untuk memeriksa kelengkapan data pengguna sebelum melakukan pemesanan
@app.route('/check_user_complete', methods=['POST'])
def check_user_complete():
    data = request.json
    user_id = data.get('user_id')

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        user_complete = all([user.get('nama'), user.get('no_hp'), user.get('alamat')])
        return jsonify({"complete": user_complete})
    return jsonify({"message": "User not found"}), 404

# Endpoint untuk membuat pesanan
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO orders (customer_id, service_id, total_pembayaran, tanggal, jam, jenis, alamat_tujuan, metode_pembayaran, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (data['customer_id'], data['service_id'], data['total_pembayaran'], data['tanggal'], data['jam'], data['jenis'], data['alamat_tujuan'], data['metode_pembayaran'], data['status']))
    db.commit()
    cursor.close()
    return jsonify({"message": "Order created successfully"})

# Endpoint untuk mendapatkan semua pesanan berdasarkan customer_id
@app.route('/orders', methods=['GET'])
def get_orders():
    customer_id = request.args.get('customer_id')
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders WHERE customer_id=%s", (customer_id,))
    orders = cursor.fetchall()
    cursor.close()
    
    # Mengonversi timedelta menjadi string
    for order in orders:
        if 'jam' in order and isinstance(order['jam'], timedelta):
            order['jam'] = convert_timedelta_to_string(order['jam'])
    
    return jsonify(orders)

@app.route('/orders/<int:order_id>/update_status', methods=['PUT'])
def update_order_status(order_id):
    db = get_db_connection()
    cursor = db.cursor()
    try:
        new_status = request.json.get('status')
        query = "UPDATE orders SET status = %s WHERE order_id = %s"
        cursor.execute(query, (new_status, order_id))
        db.commit()
        return jsonify({'message': 'Order status updated successfully'})
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to update order status'}), 500
    finally:
        cursor.close()

        
# Endpoint untuk menyimpan review
@app.route('/reviews', methods=['POST'])
def create_review():
    data = request.json
    order_id = data.get('order_id')
    rating = data.get('rating')
    ulasan = data.get('ulasan')

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO reviews (order_id, rating, ulasan, status)
        VALUES (%s, %s, %s, 'selesai')
    """, (order_id, rating, ulasan))
    db.commit()
    cursor.close()

    return jsonify({"message": "Review created successfully"}), 201

# Endpoint untuk mendapatkan review berdasarkan order_id
@app.route('/reviews/<int:order_id>', methods=['GET'])
def get_review(order_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reviews WHERE order_id=%s", (order_id,))
    review = cursor.fetchone()
    cursor.close()
    if review:
        return jsonify(review), 200
    return jsonify({"message": "Review not found"}), 404




if __name__ == '__main__':
    app.run(debug=True)
