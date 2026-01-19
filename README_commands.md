# Terminal komande za rješavanje zadatka

## 1. Instalacija ovisnosti

Ako već nisi:
```
npm install
```

## 2. Pokretanje migracija (kreiranje tablica)
```
npx knex migrate:latest
```

## 3. (Opcionalno) Seedanje baze podataka
Ako imaš seed fajlove:
```
npx knex seed:run
```

## 4. Pokretanje servera
```
node server.js
```

ili (ako koristiš nodemon):
```
nodemon server.js
```

## 5. Pokretanje testova
```
npm test
```

## 6. Git komande za commit i push
```
git add .
git commit -m "Rješenje kolokvija - API za ocjenjivanje filmova"
git push
```

---

Ako naiđeš na grešku, pročitaj poruku u terminalu i provjeri da su svi koraci iz README.md odrađeni.