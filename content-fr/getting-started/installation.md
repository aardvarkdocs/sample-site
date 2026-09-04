---
description: Installez Aardvark via Homebrew ou un binaire de release précompilé. Node est
  requis à la compilation pour regrouper les îlots Mantine.
menu: docs
title: Installation
weight: 11
---

# Installation

## Prérequis

| Outil | Version | Pourquoi |
| --- | --- | --- |
| Node.js | Node ≥ 20.19 | Exécute esbuild et le pré-rendu des îlots à la compilation |

Le binaire `vark` est autonome — il embarque son propre runtime Python **et la
chaîne d'outils JS des îlots** (React, Mantine, esbuild et tout ce que ses
composants intégrés regroupent), il n'y a donc rien d'autre à installer et rien à
télécharger : un projet sans `node_modules` reçoit automatiquement la chaîne
d'outils embarquée à sa première compilation. Node est le seul prérequis, utilisé
pour l'exécuter. Vous pouvez vous en passer avec `vark build --no-bundle` (les
composants s'affichent alors comme des espaces réservés inertes). npm n'intervient
que si votre `package.json` demande des paquets ou des versions qu'Aardvark
n'embarque pas — la première compilation lance alors `npm ci`/`npm install` pour
vous (désactivable avec `AARDVARK_NO_AUTO_NPM`), et un `node_modules` que vous
installez vous-même prend toujours le pas sur la chaîne embarquée.

## Installer avec Homebrew (macOS)

Le moyen le plus rapide sur un Mac — installe un binaire autonome, aucun Python
requis :

```bash
brew tap aardvarkdocs/tap
brew install aardvark
vark --version
```

Le paquet Homebrew s'appelle `aardvark` (comme le projet), mais il installe la CLI
sous le nom **`vark`** — plus court à taper. (`aardvark` est aussi installé comme
alias, les deux noms fonctionnent donc.) Mettez à jour plus tard avec
`brew update && brew upgrade aardvark`.

## Windows et Linux

Téléchargez le binaire précompilé depuis la
[dernière release](https://github.com/aardvarkdocs/homebrew-tap/releases/latest)
(`aardvark-<version>-windows-x86_64.zip` ou les tarballs
`aardvark-<version>-linux-x86_64.tar.gz` / `…-linux-aarch64.tar.gz`), placez `vark`
sur votre `PATH`, puis lancez `vark --version`.

Le binaire embarque le thème par défaut et le runtime des îlots, il fonctionne
donc immédiatement. Node n'est nécessaire qu'à la *compilation du site* pour les
îlots interactifs — voir [Déploiement](/deployment/) pour les détails.

Toutes les archives de release simples — tarballs macOS et Linux, zip Windows — ne
contiennent que l'exécutable `vark`, sans alias `aardvark` : créez votre propre lien
symbolique si vous voulez le nom long à partir d'une archive téléchargée.

## Rester à jour

`vark update` interroge le flux des releases pour savoir si une version plus
récente existe et indique comment l'obtenir — il ne télécharge ni ne remplace
jamais le binaire lui-même : mettez à jour avec `brew upgrade aardvark` ou en
téléchargeant la nouvelle archive. Toute autre commande, lancée dans un terminal
interactif, effectue la même vérification en arrière-plan et affiche un rappel
d'une ligne si vous êtes en retard. Définissez `AARDVARK_NO_UPDATE_CHECK=1` pour
le faire taire ; il est déjà silencieux quand la sortie n'est pas un terminal,
pour `--help` / `--version` et pour la complétion du shell.

## Fonctionnalités IA

Les fonctionnalités IA d'Aardvark sont intégrées au binaire — rien d'autre à
installer. Activez-les dans `aardvark.config.yaml` (le bloc `ai:`) et fournissez
une clé. Voir [Fonctionnalités IA](/ai/) pour la vue d'ensemble,
[IA à la compilation](/ai-features/) pour les options d'enrichissement à la
compilation, et [Passerelle cloud](/ai-gateway/) pour l'assistant de lecture
hébergé.
