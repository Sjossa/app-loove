

# MeetLink

## Description

MeetLink est une application web de mise en relation (matching) composée d’un backend en PHP et d’un frontend en JavaScript (React, ou autre selon ton projet).

---

## Installation

### 1. Backend

Le backend doit être installé dans un **dossier/vhost séparé** de celui du frontend.

* Installer Composer si ce n’est pas déjà fait :
  [https://getcomposer.org/download/](https://getcomposer.org/download/)
* Ensuite, dans le dossier backend, lancer la commande :

  ```bash
  composer install
  ```

---

### 2. Frontend

Le frontend doit aussi être installé dans un **dossier/vhost différent** de celui du backend.

* Assurez-vous d’avoir Node.js et npm installés :
  [https://nodejs.org/](https://nodejs.org/)
* Dans le dossier frontend, lancer la commande :

  ```bash
  npm install
  ```

---

## Lancement

* Lancer le serveur backend (ex. via `php -S` ou serveur Apache/Nginx configuré).
* Lancer le frontend (ex. `npm start` ou build statique selon ton projet).

---

## Notes

* Backend et frontend doivent communiquer via API, penser à bien configurer CORS si besoin.
* Chaque partie doit tourner sur un domaine ou port distinct.

---

Si tu veux, je peux aussi t’aider à formater un README plus complet avec sections sur la structure, usage, variables d’environnement, etc.
Dis-moi si ça t’intéresse !
