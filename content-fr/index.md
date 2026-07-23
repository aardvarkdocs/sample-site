---
description: aardvark est un générateur de site statique propulsé par Mantine — rédigez
  en Markdown, compilez en HTML statique rapide avec des îlots React interactifs.
heading: Prise en main
menu: docs
title: Introduction
weight: 10
---

# aardvark

**aardvark** est un générateur de site statique axé sur la documentation. Vous
rédigez en Markdown et compilez en HTML statique. L'interface interactive est
livrée sous forme d'**îlots** : aardvark émet le HTML, et Mantine ainsi que vos
propres composants React sont rendus dans le navigateur depuis un unique
runtime regroupé.

Ce site même est construit avec aardvark.

## Pourquoi aardvark

- **Markdown en entrée, HTML en sortie** — des URL propres, une table des
  matières et un thème par défaut soigné.
- **Vrai templating Python** — la logique vit dans des balises
  `{% raw %}{% %}{% endraw %}` et c'est du véritable Python, avec vos données
  structurées exposées via `data.<fichier>.<propriété>`.
- **Tous les composants Mantine** — intégrez n'importe quel composant Mantine
  (et vos propres extraits React) directement depuis le Markdown ; ils
  sont rendus en îlots.
- **Tout inclus** — recherche intégrée ⌘K, assistant « Ask AI » intégré, Google Analytics avec
  événements de notation de page, pages de référence OpenAPI « essayez
  maintenant », et génération automatique de `sitemap.xml` + `llms.txt`.
- **IA optionnelle à la compilation** — une fois activée, générez le
  frontmatter, des exemples de réponses d'API et un plan de création de
  compétences à partir de votre documentation.
- **Livré en un seul binaire** — compilez l'outil en un exécutable unique avec
  Nuitka. Node n'est requis qu'au moment de la compilation pour regrouper les
  îlots.

## Comment tout s'assemble

1. Vous écrivez du Markdown dans `content/`, des données structurées dans
   `data/`, et éventuellement des composants React personnalisés dans
   `snippets/`.
2. `vark build` exécute le templating Python `{% raw %}{% %}{% endraw %}`, rend le
   Markdown en HTML, rassemble chaque appel `{% raw %}{% component(...) %}{% endraw %}`
   en points de montage d'îlots, et regroupe les composants Mantine/extraits
   référencés avec esbuild.
3. La sortie dans `build/` est du HTML statique simple + un seul paquet JS/CSS,
   prêt à être hébergé n'importe où.

## Étapes suivantes

- [Installation](/fr/getting-started/installation/) — procurez-vous l'outil.
- [Démarrage rapide](/fr/#demarrage-rapide) — construisez votre premier site en une minute.
- [Galerie de composants](/components/) — des exemples de composants Mantine rendus en direct, appelables directement depuis Markdown.

## Démarrage rapide {#demarrage-rapide}

Une fois [aardvark installé](/fr/getting-started/installation/), vous pouvez créer,
prévisualiser et compiler votre premier site en quelques commandes.

### 1. Créer un site

```bash
vark new my-docs
cd my-docs
```

Cette commande crée un projet avec une page de démarrage, un fichier de données,
le thème par défaut modifiable, un exemple de composant et un `package.json` pour
les îlots.

### 2. Installer les dépendances des îlots

```bash
npm install
```

Cette commande installe React, Mantine et esbuild, qu'aardvark utilise pour
regrouper les composants que vous intégrez.

### 3. Développer avec le rechargement automatique

```bash
vark dev --port 8000
```

`vark dev` compile le site, le sert sur `http://127.0.0.1:8000`, ouvre cette URL
dans votre navigateur, surveille vos fichiers sources et recharge le navigateur
à chaque modification. Ajoutez `--no-open` si vous préférez ouvrir vous-même
l'onglet.

### 4. Compiler pour la production

```bash
vark build      # génère le HTML statique dans ./build
```

### Créer votre première page

Une page aardvark est un fichier Markdown avec un frontmatter YAML facultatif.
La logique est du véritable Python placé dans des balises
`{% raw %}{% %}{% endraw %}` :

{% raw %}
```aardvark
---
title: Bonjour
---

# Bonjour

Ce site propose {% len(components) %} composants Mantine.

{% component('Button', children='Cliquez ici', color='blue') %}
```
{% endraw %}

Voilà ! Poursuivez avec la documentation sur la
[structure du projet](/getting-started/project-structure/) ou passez directement
aux [templates et données](/authoring/templating/).
