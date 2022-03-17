from flask import Flask, request, jsonify
from flask_caching import Cache
from flask_sockets import Sockets
from database1 import add_forgot_code_to_user, change_user_avatar, change_user_email, change_user_login, get_articles_blog_by_user_id, get_profile_info, get_subscriptions, get_article, get_articles_subscriptions, get_articles_blog, set_article, set_subscription, del_article, del_subscription, update_article, get_most_recent_articles, get_user_id, request_user_avatar, request_user, check_admin, add_user, change_user_password, get_user_login, plus_view_on_article
from excrptions import AccountExists, AccountNotFound, SignupLoginError, SignupEmailError, EmptyValuesAreEntered, CreateArticleTokenError
from send_mail import send_message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import jwt
import os
import json



app = Flask(__name__, template_folder="templates")
# Отмена кэширования статических файлов
app.config["CACHE_TYPE"] = "null"
# Инициализация кэша приложения
cache = Cache(app)
cache.init_app(app)
app.config['UPLOAD_FOLDER'] = "static/"
CORS(app)

app.secret_key = "FIYGRFERBKCYBKEUYVCYECERUYBCRU"
sockets = Sockets(app)
secret_key_for_images = "FHIRLUGIGYRERLVBUV132BJHVLYRFEHRCEBVKRRVJHBVB34"
# Secret_key из переменной окружения моего ноутбука.
# app.secret_key = str(subprocess.check_output(['launchctl', 'getenv', 'SECRET_KEY']))[2:-3]
url = "http://127.0.0.1:5000"

ma = Marshmallow(app)


class Article_m(ma.Schema):
    class Meta:
        fields = ['id', 'blog_id', 'title', 'image', 'prev_content',
                  'content', 'category', 'tags', 'date', 'views']


article_m = Article_m(many=False)


class Articles_m(ma.Schema):
    class Meta:
        fields = ['id', 'blog_id', 'title', 'image',
                  'prev_content', 'category', 'tags', 'date', 'views']


articles_m = Articles_m(many=True)


class Subscriptions_m(ma.Schema):
    class Meta:
        fields = ['blog_id']


subscriptions_m = Subscriptions_m(many=True)


class Author_m(ma.Schema):
    class Meta:
        fields = ['login', 'avatar']


login_u = Author_m(many=False)


@app.route("/main_page", methods=["GET"])
def show_main_page():
    articles = get_most_recent_articles()
    result = articles
    return jsonify(result)


@app.route("/article/<int:article_id>", methods=["GET"])
def show_article(article_id):
    article, author = get_article(article_id)
    result = article_m.dump(article)
    result["author"] = login_u.dump(author)
    return jsonify(result)


@app.route('/my_subscriptions', methods=["GET"])
def show_subscriptions():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    print(f'Это user_id{user_id}')
    subscriptions = get_subscriptions(user_id)
    result = subscriptions_m.dumps(subscriptions)
    return jsonify(result)


@app.route('/tape', methods=["GET"])
def show_articles_by_subscriptions():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    articles = get_articles_subscriptions(user_id)
    result = articles
    return jsonify(result)


@app.route('/user_articles/<login>', methods=["GET"])
def show_user_blog(login):
    try: 
        articles = get_articles_blog(login)
        print(articles)
        result = articles
        # result["articles"] = json.loads(articles_m.dumps(articles))
        # print(result)
        # result["author"] = login_u.dump(author)
        return jsonify(result)
    except:
        return jsonify({'error': True})


@app.route('/my_articles', methods=["GET"])
def show_my_articles():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    articles = get_articles_blog(user_id)
    print(articles)
    result = articles
    # result["articles"] = json.loads(articles_m.dumps(articles))
    # print(result)
    # result["author"] = login_u.dump(author)
    return jsonify(result)


@app.route('/edit/article', methods=["POST"])
def add_article():
    data = dict(request.form)
    token = data["token"]
    token = jwt.decode(bytes(token, encoding='utf-8'),
                       app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(token)
    title = data['title']
    prev_content = data['prev_content']
    content = data['content']
    category = data['category']
    tags = data['tags']
    try: 
        file = request.files["image"]
        extens = file.filename.split(".")[-1].replace("\"", "")
        # Создаём имя файла, хэшируя его
        file_name = generate_password_hash(title + secret_key_for_images)
        # Убираем из названия все : и тп
        file_name = file_name.replace(":", "") + '.' + extens
        path = app.config["UPLOAD_FOLDER"]
        full_path = path + file_name
        print("Это full path: " + full_path)
    except:
        file_name = ''
    try:
        article_id = set_article(user_id, title, file_name, prev_content, content, category, tags)
        print(article_id)
        try: 
            file.save(os.path.join(path, file_name))
        except:
            pass
        return jsonify({"error": False, 'id': article_id})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except:
        return jsonify({"error": True})


@app.route('/subscription/<int:blog_id>', methods=["POST"])
def add_subscription(blog_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    subscriptions = get_subscriptions(user_id)
    if blog_id not in subscriptions:
        try:
            subscription = set_subscription(user_id, blog_id)
            return jsonify({"error": False})
        except:
            return jsonify({"error": True})
    else:
        return jsonify({"error": True})


@app.route('/article/<int:article_id>', methods=["DELETE"])
def del_article_(article_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(user_id)
    created_articles = get_articles_blog_by_user_id(user_id)
    articles = [i["id"]
                for i in json.loads(articles_m.dumps(created_articles))]
    admin = check_admin(user_id)
    print(created_articles)
    if article_id in articles or admin:
        del_article(article_id)
        return jsonify({"error": False})
    else:
        return jsonify({"error": True})


@app.route('/subscription/<int:blog_id>', methods=["DELETE"])
def del_subscription_(blog_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(user_id)
    subscriptions = get_subscriptions(user_id)
    subscriptions_ = [i["blog_id"] for i in json.loads(subscriptions_m.dumps(subscriptions))]
    admin = check_admin(user_id)
    if blog_id in subscriptions_ or admin:
        del_subscription(user_id, blog_id)
        return jsonify({"error": False})
    else:
        return jsonify({"error": True})


@app.route('/edit/article/<int:article_id>', methods=["PUT"])
def update_article_(article_id):
    data = dict(request.form)
    token = data["token"]
    token = jwt.decode(bytes(token, encoding='utf-8'),
                       app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(token)
    title = data['title']
    prev_content = data['prev_content']
    content = data['content']
    category = data['category']
    tags = data['tags']
    try:
        file = request.files["image"]
        extens = file.filename.split(".")[-1].replace("\"", "")
        # Создаём имя файла, хэшируя его
        file_name = generate_password_hash(title + secret_key_for_images)
        # Убираем из названия все : и тп
        file_name = file_name.replace(":", "") + '.' + extens
        path = app.config["UPLOAD_FOLDER"]
        full_path = path + file_name
        print("Это full path: " + full_path)
    except:
        file_name = ''
    try:
        update_article(article_id, user_id, title, file_name,
                       prev_content, content, category, tags)
        try:
            file.save(os.path.join(path, file_name))
        except:
            pass
        return jsonify({"error": False})
    except CreateArticleTokenError:
        return jsonify({"error": 'CreateArticleTokenError'})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except:
        return jsonify({"error": True})


# Страница авторизации/регистрации/восстановления пароля/подтверждения нового пароля
@app.route('/authorization/<form>', methods=['POST'])
def post(form):
    if form == "log_in":
        email = request.json['email']
        password = request.json['password']
        try:
            forAction = request.json['forAction']
        except:
            forAction = ''
        if (forAction == ''):
            try:
                email, password_hash_valid = request_user(email)
                bool_hash = check_password_hash(password_hash_valid, password)
            except AccountNotFound:
                return jsonify({"error": True})
            if bool_hash:
                avatar = request_user_avatar(email)
                user_id = get_user_id(email)
                admin = check_admin(user_id)
                login = get_user_login(email)
                token = jwt.encode(
                    {'login': user_id}, key=app.secret_key, algorithm='HS256')
                print(token)
                return jsonify({'token': token, 'avatar': f"{avatar}", "admin": admin, "login": login})
            else:
                return jsonify({"error": True})
        elif (forAction == 'change'):
            try:
                add_forgot_code_to_user(email)
                return jsonify({"error": False})
            except AccountNotFound:
                return jsonify({"error": True})

    elif form == "sign_up":

        login = request.json['login']
        email = request.json['email']
        password = request.json['password']
        try:
            add_user(login=login, email=email, password=password)
        except AccountExists:
            return jsonify({"error": True})
        except SignupEmailError:
            return jsonify({"error": 'SignupEmailError'})
        except SignupLoginError:
            return jsonify({"error": 'SignupLoginError'})
        except EmptyValuesAreEntered:
            return jsonify({"error": 'EmptyValuesAreEntered'})
        return jsonify({"error": False})

@app.route('/plus/view/<int:article_id>', methods=["GET"])
def plus_view(article_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    login = token["login"]
    try:
        rez = plus_view_on_article(login, article_id)
        return jsonify({"error": False, "plus": rez})
    except:
        return jsonify({"error": True})

@app.route('/profile/<login>', methods=["GET"])
def view_user_profile(login):
    try:
        result = get_profile_info(login)
        return jsonify(result)
    except:
        return jsonify({'error': True})

@app.route('/edit_profile', methods=["POST"])
def edit_profile():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    login = token["login"]
    forgot_code = request.json["forgotCode"]
    try:
        old_email = request.json["oldEmail"]
        new_email = request.json["newEmail"]
        change_user_email(login, old_email, new_email, forgot_code)
        return jsonify({"error": False, "user_id": login})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except: pass

    try:
        old_login = request.json["oldLogin"]
        new_login = request.json["newLogin"]
        change_user_login(login, old_login, new_login, forgot_code)
        return jsonify({"error": False, "user_id": login})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except: pass

    try:
        old_password = request.json["oldPassword"]
        new_password = request.json["newPassword"]
        change_user_password(login, old_password, new_password, forgot_code)
        return jsonify({"error": False, "user_id": login})
    except EmptyValuesAreEntered:
        return jsonify({"error": 'EmptyValuesAreEntered'})
    except: pass

    try:
        file = request.files["image"]
        extens = file.filename.split(".")[-1].replace("\"", "")
        # Создаём имя файла, хэшируя его
        file_name = generate_password_hash(login + secret_key_for_images)
        # Убираем из названия все : и тп
        file_name = file_name.replace(":", "") + '.' + extens
        path = app.config["UPLOAD_FOLDER"]
        full_path = path + file_name
    except:
        file_name = ''
    try:
        change_user_avatar(login, file_name)
        try:
            file.save(os.path.join(path, file_name))
        except:
            pass
        return jsonify({"error": False})
    except:
        return jsonify({"error": True})

# Это позже внедрим
@app.route('/confirm_email', methods=["POST"])
def confirm_email():
    toEmail = request.json["toEmail"]
    try:
        send_message(toEmail, "Подтверждение почты", f"Для подтверждения почты прейдите по ссылке")
        return jsonify({'error': False})
    except:
        return jsonify({'error': True})
    

app.run()
