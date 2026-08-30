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

## Fonctionnalités IA

Les fonctionnalités IA d'Aardvark sont intégrées au binaire — rien d'autre à
installer. Activez-les dans `aardvark.config.yaml` (le bloc `ai:`) et fournissez
une clé. Voir [Fonctionnalités IA](/ai/) pour la vue d'ensemble,
[IA à la compilation](/ai-features/) pour les options d'enrichissement à la
compilation, et [Passerelle cloud](/ai-gateway/) pour l'assistant de lecture
hébergé.
