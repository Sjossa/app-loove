-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 20 juin 2025 à 18:39
-- Version du serveur : 8.0.42-0ubuntu0.24.04.1
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `meetlink`
--

-- --------------------------------------------------------

--
-- Structure de la table `abonnement`
--

CREATE TABLE `abonnement` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `statut` enum('actif','suspendu','annule') COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `mode_paiement` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `abonnement`
--

INSERT INTO `abonnement` (`id`, `user_id`, `type`, `date_debut`, `date_fin`, `statut`, `mode_paiement`, `date_creation`) VALUES
(8, 3, 'premium', '2025-06-20', NULL, 'actif', 'paypal', '2025-06-20 07:13:05');

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `prenom` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `prenom`, `email`, `password`) VALUES
(1, 'admin', 'admin@admin.fr', '$2y$10$TatmzYAfOrWlwLiR.zxsYez9.GWtAUIh/G/jMLQHad6UOo2rO7k36');

-- --------------------------------------------------------

--
-- Structure de la table `conversation`
--

CREATE TABLE `conversation` (
  `id` int NOT NULL,
  `user1_id` int DEFAULT NULL,
  `user2_id` int DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `conversation`
--

INSERT INTO `conversation` (`id`, `user1_id`, `user2_id`, `create_at`) VALUES
(1, 3, 27, '2025-06-03 09:52:23'),
(2, 3, 28, '2025-06-16 15:05:52'),
(3, 1, 3, '2025-06-20 14:38:01'),
(4, 1, 117, '2025-06-20 14:39:44'),
(5, 3, 117, '2025-06-20 14:40:18');

-- --------------------------------------------------------

--
-- Structure de la table `dislikes`
--

CREATE TABLE `dislikes` (
  `id` int NOT NULL,
  `dislike_id` int NOT NULL,
  `disliked_id` int NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dislikes`
--

INSERT INTO `dislikes` (`id`, `dislike_id`, `disliked_id`, `datetime`) VALUES
(785, 3, 118, '2025-06-19 11:27:49'),
(786, 3, 127, '2025-06-19 13:12:57'),
(788, 3, 124, '2025-06-19 14:29:03'),
(789, 3, 123, '2025-06-19 14:29:06'),
(791, 3, 119, '2025-06-19 17:32:47'),
(799, 3, 117, '2025-06-20 14:02:51'),
(801, 3, 125, '2025-06-20 14:13:23'),
(802, 117, 124, '2025-06-20 14:24:54'),
(803, 117, 120, '2025-06-20 14:24:55'),
(804, 117, 123, '2025-06-20 14:24:55'),
(806, 117, 119, '2025-06-20 14:24:57'),
(808, 117, 118, '2025-06-20 14:24:58'),
(809, 117, 125, '2025-06-20 14:24:59'),
(810, 117, 121, '2025-06-20 14:25:00'),
(812, 3, 126, '2025-06-20 14:25:17'),
(813, 3, 122, '2025-06-20 14:25:18'),
(823, 3, 121, '2025-06-20 14:25:30'),
(826, 3, 128, '2025-06-20 15:38:25'),
(830, 3, 134, '2025-06-20 20:11:55'),
(831, 3, 120, '2025-06-20 20:11:57'),
(832, 3, 133, '2025-06-20 20:11:58');

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` int NOT NULL,
  `liker_id` int NOT NULL,
  `liked_id` int NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `liker_id`, `liked_id`, `datetime`) VALUES
(559, 117, 3, '2025-06-20 14:25:02'),
(560, 3, 117, '2025-06-20 14:25:33'),
(561, 3, 119, '2025-06-20 15:38:27'),
(562, 3, 122, '2025-06-20 15:49:05'),
(563, 3, 126, '2025-06-20 17:25:04'),
(564, 3, 121, '2025-06-20 17:39:59'),
(565, 3, 125, '2025-06-20 18:19:50'),
(566, 3, 128, '2025-06-20 20:20:28'),
(567, 3, 132, '2025-06-20 20:25:21'),
(568, 3, 131, '2025-06-20 20:25:26'),
(569, 3, 134, '2025-06-20 20:25:27'),
(570, 3, 133, '2025-06-20 20:25:30'),
(571, 3, 129, '2025-06-20 20:25:39');

-- --------------------------------------------------------

--
-- Structure de la table `matchs`
--

CREATE TABLE `matchs` (
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `receiver_id`, `content`, `created_at`, `is_read`) VALUES
(178, 1, 27, 3, 'salut bg', '2025-06-18 11:50:55', NULL),
(179, 1, 3, 27, 'fff', '2025-06-18 11:51:03', NULL),
(180, 2, 28, 3, 'johnny', '2025-06-18 17:48:50', NULL),
(181, 2, 28, 3, 'j', '2025-06-18 17:49:28', NULL),
(182, 2, 28, 3, 'aaa', '2025-06-18 17:49:43', NULL),
(183, 2, 28, 3, 't', '2025-06-18 17:49:58', NULL),
(184, 2, 28, 3, 'a', '2025-06-18 17:50:00', NULL),
(185, 2, 3, 28, 'kk', '2025-06-18 17:50:44', NULL),
(186, 2, 3, 28, 'ggggg', '2025-06-18 17:50:53', NULL),
(187, 2, 3, 28, 'ssss', '2025-06-18 17:51:19', NULL),
(188, 2, 3, 28, 'xxxx', '2025-06-18 17:51:27', NULL),
(189, 2, 3, 28, 'cc', '2025-06-18 17:53:11', NULL),
(190, 2, 3, 28, 'x', '2025-06-18 17:53:40', NULL),
(191, 2, 3, 28, 'cccc', '2025-06-18 17:55:02', NULL),
(192, 2, 3, 28, 'ddd', '2025-06-18 17:55:57', NULL),
(193, 2, 28, 3, 'lll', '2025-06-18 17:57:29', NULL),
(194, 2, 28, 3, 'i', '2025-06-18 18:03:16', NULL),
(195, 2, 28, 3, 'A', '2025-06-18 18:04:51', NULL),
(196, 2, 28, 3, 'a', '2025-06-18 18:04:53', NULL),
(197, 2, 28, 3, 'a', '2025-06-18 18:04:54', NULL),
(198, 2, 28, 3, 'a', '2025-06-18 18:04:55', NULL),
(199, 2, 28, 3, 'a', '2025-06-18 18:04:57', NULL),
(200, 2, 28, 3, 'a', '2025-06-18 18:05:05', NULL),
(201, 2, 28, 3, 'a', '2025-06-18 18:05:07', NULL),
(202, 2, 28, 3, 'a', '2025-06-18 18:05:08', NULL),
(203, 2, 28, 3, 'a', '2025-06-18 18:05:09', NULL),
(204, 2, 28, 3, 'ccc', '2025-06-18 18:06:59', NULL),
(205, 2, 28, 3, 'a', '2025-06-18 18:08:59', NULL),
(206, 2, 28, 3, 'message', '2025-06-18 18:15:09', NULL),
(207, 2, 28, 3, 'a', '2025-06-18 18:18:20', NULL),
(208, 2, 28, 3, 'x', '2025-06-18 18:18:36', NULL),
(209, 2, 28, 3, 'aaaaa', '2025-06-18 18:19:27', NULL),
(210, 2, 28, 3, 'ssss', '2025-06-18 18:22:24', NULL),
(211, 2, 3, 28, 'aaaaaa', '2025-06-18 18:23:10', NULL),
(212, 2, 28, 3, 'aaaaaaaaa', '2025-06-18 18:23:14', NULL),
(213, 5, 1, 117, 'aaaaa', '2025-06-20 14:40:37', NULL),
(214, 5, 3, 117, 'ffff', '2025-06-20 14:41:00', NULL),
(215, 5, 117, 3, 'ffffff', '2025-06-20 14:41:11', NULL),
(216, 5, 3, 117, 'jj', '2025-06-20 14:49:39', NULL),
(217, 5, 3, 117, 'qqq', '2025-06-20 18:10:27', NULL),
(218, 5, 3, 117, 'johnny', '2025-06-20 18:10:58', NULL),
(219, 5, 3, 117, 'zzzz', '2025-06-20 18:11:16', NULL),
(220, 5, 117, 3, 'aaaa', '2025-06-20 18:14:35', NULL),
(221, 5, 117, 3, 'kkkk', '2025-06-20 18:14:43', NULL),
(222, 5, 3, 117, 'jj', '2025-06-20 18:17:48', NULL),
(223, 5, 3, 117, 'kkk', '2025-06-20 18:18:05', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int DEFAULT NULL,
  `localisation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orientation` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relation_recherchee` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interets` text COLLATE utf8mb4_unicode_ci,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `petit_plus` text COLLATE utf8mb4_unicode_ci,
  `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_online` tinyint(1) NOT NULL DEFAULT '0',
  `last_active` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `prenom`, `nom`, `age`, `localisation`, `email`, `password`, `statut`, `orientation`, `relation_recherchee`, `interets`, `bio`, `petit_plus`, `profile_picture`, `created_at`, `is_online`, `last_active`) VALUES
(3, 'Johnny', 'Sassiat', 23, 'Triguères', 'johnnysass@hotmail.fr', '$2y$10$ft1uopt20h8MCtrfIzChiOQwDqlyUznvW7sZutNF6NqeJjBzUbmqO', 'celibataire', 'straight', 'couple', NULL, 'aaaa', 'alphose', 'photo/68550d893a57a640px-The_Elder_Scrolls_5_Skyrim_Logo.png', '2025-05-23 08:18:18', 1, '2025-06-20 07:29:09'),
(117, 'Thomas', 'Martin', 32, 'Lyon, France', 'thomas.martin@email.com', '$2a$12$R/OfmM5iPlb0fLyGtEiYuuYWF0OUSxXf41kOqUeVYAtATkC1JMFXi', 'Divorcé', 'Hétérosexuel', 'Relation sérieuse', 'Sport, cinéma, randonnée, cuisine, technologie', 'Développeur passionné, j\'aime les activités en plein air et les soirées film. Papa d\'un petit garçon de 8 ans. Je recherche une personne authentique pour construire quelque chose de beau ensemble.', 'Je fais le meilleur tiramisu de Lyon (certifié par ma grand-mère italienne) !', 'photo/68550d893a57a640px-The_Elder_Scrolls_5_Skyrim_Logo.png', '2025-06-19 09:07:37', 1, '2025-06-20 12:24:40'),
(118, 'Sophie', 'Leroy', 26, 'Bordeaux, France', 'sophie.leroy@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Célibataire', 'Bisexuelle', 'Amitié/Relation', 'Musique, danse, art, sorties, voyages', 'Artiste peintre et professeure de danse, j\'aime la vie sous toutes ses formes. Toujours partante pour une nouvelle aventure ou une soirée dansante !', 'Mes toiles sont exposées dans 3 galeries en France et j\'ai participé à \"Danse avec les Stars\" amateur !', 'sophie_profile.jpg', '2025-06-19 09:07:37', 1, '2025-06-19 09:07:37'),
(119, 'Alexandre', 'Rousseau', 35, 'Marseille, France', 'alexandre.rousseau@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Célibataire', 'Hétérosexuel', 'Relation sérieuse', 'Voile, plongée, lecture, vin, gastronomie', 'Médecin urgentiste, j\'ai besoin de moments de détente après des journées intenses. Passionné de mer et de bon vin. Je cherche quelqu\'un de complice et d\'indépendant.', 'Je possède un voilier et j\'organise des sorties en mer tous les week-ends !', 'alexandre_profile.jpg', '2025-06-19 09:07:37', 0, '2024-06-17 20:15:00'),
(120, 'Camille', 'Moreau', 29, 'Toulouse, France', 'camille.moreau@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'En couple libre', 'Pansexuelle', 'Rencontres libres', 'Théâtre, littérature, philosophie, méditation', 'Philosophe et comédienne, j\'explore les relations humaines sous toutes leurs formes. Ouverte d\'esprit et curieuse de tout. En couple libre, je cherche des connexions authentiques.', 'J\'ai écrit une pièce de théâtre qui sera jouée au Festival d\'Avignon cet été !', 'camille_profile.jpg', '2025-06-19 09:07:37', 1, '2025-06-19 09:07:37'),
(121, 'Julien', 'Bernard', 30, 'Nantes, France', 'julien.bernard@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Célibataire', 'Homosexuel', 'Relation sérieuse', 'Fitness, mode, design, voyages, gastronomie', 'Designer graphique passionné de fitness et de mode. J\'aime prendre soin de moi et découvrir de nouveaux endroits. Je recherche mon âme sœur pour partager mes passions.', 'Je cours le marathon de Paris chaque année depuis 5 ans !', 'julien_profile.jpg', '2025-06-19 09:07:37', 1, '2025-06-19 09:07:37'),
(122, 'Emma', 'Petit', 24, 'Lille, France', 'emma.petit@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Célibataire', 'Hétérosexuelle', 'Amitié/Relation', 'Gaming, anime, cosplay, programmation, musique électronique', 'Développeuse web et gameuse invétérée. J\'adore les conventions anime et le cosplay. Plutôt introvertie mais très fidèle en amitié. Je cherche quelqu\'un qui partage mes passions !', 'J\'ai gagné le concours de cosplay à la Japan Expo 2023 !', 'emma_profile.jpg', '2025-06-19 09:07:37', 0, '2024-06-18 18:45:00'),
(123, 'Lucas', 'Roux', 33, 'Strasbourg, France', 'lucas.roux@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Séparé', 'Hétérosexuel', 'Relation sérieuse', 'Escalade, montagne, photographie nature, bière artisanale', 'Guide de montagne et photographe amateur. Récemment séparé, je redécouvre les joies de la vie de célibataire. J\'aime l\'authenticité et les grands espaces.', 'Mes photos de montagne ont été publiées dans Géo Magazine !', 'lucas_profile.jpg', '2025-06-19 09:07:37', 0, '2024-06-16 12:20:00'),
(124, 'Léa', 'Garnier', 27, 'Nice, France', 'lea.garnier@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Célibataire', 'Lesbienne', 'Relation sérieuse', 'Surf, yoga, écologie, cuisine végétarienne, festivals', 'Instructrice de surf et militante écologiste. Je vis près de la mer et j\'aime les couchers de soleil sur la plage. Je cherche une femme qui partage mes valeurs et mon amour de la nature.', 'J\'ai traversé l\'Atlantique en voilier pour sensibiliser à la pollution marine !', 'lea_profile.jpg', '2025-06-19 09:07:37', 1, '2025-06-19 09:07:37'),
(125, 'Antoine', 'Simon', 36, 'Rennes, France', 'antoine.simon@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Veuf', 'Hétérosexuel', 'Amitié puis voir', 'Jardinage, bricolage, lecture, famille, balades', 'Veuf depuis 2 ans, papa de deux adolescents. Professeur d\'histoire, j\'aime les choses simples de la vie. Je ne cherche pas à me précipiter mais je suis ouvert aux belles rencontres.', 'Mon potager bio nourrit toute ma famille et mes voisins !', 'antoine_profile.jpg', '2025-06-19 09:07:37', 0, '2024-06-17 09:30:00'),
(126, 'Chloé', 'Laurent', 25, 'Montpellier, France', 'chloe.laurent@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Célibataire', 'Hétérosexuelle', 'Relation libre', 'Festivals, musique, art urbain, skate, voyages backpack', 'Étudiante en beaux-arts et DJ le week-end. J\'aime la liberté et les rencontres sans prise de tête. Toujours en mouvement, j\'explore le monde avec mon sac à dos !', 'J\'ai fait le tour de l\'Europe avec seulement 500€ en poche !', 'chloe_profile.jpg', '2025-06-19 09:07:37', 1, '2025-06-19 09:07:37'),
(127, 'Maxime', 'Durand', 31, 'Reims, France', 'maxime.durand@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Célibataire', 'Hétérosexuel', 'Relation sérieuse', 'Œnologie, gastronomie, golf, voyages culturels', 'Sommelier dans un restaurant étoilé. Passionné par l\'art de vivre à la française. Je recherche une femme raffinée qui apprécie les plaisirs de la table et les voyages culturels.', 'J\'ai une cave de plus de 300 bouteilles et je connais l\'histoire de chacune !', 'maxime_profile.jpg', '2025-06-19 09:07:37', 0, '2024-06-18 07:15:00'),
(128, 'johnny', 'o', 19, 'm', 'ff@f.fr', '$2y$10$y0uAaJ7C8EO3HFpzEDA/7uGJLxmyVtVOpPjT50iVRSBmkrDIg5x6y', 'zz', 'zzz', 'zzz', 'zzzz', 'zzzz', 'zzzz', 'photo/68550d893a57a640px-The_Elder_Scrolls_5_Skyrim_Logo.png', '2025-06-20 07:28:10', 0, '2025-06-20 07:28:10'),
(129, 'johnny', 'sassiat', 18, 'dddd', 'dd@d.fr', '$2y$10$.FLcYYOAPvMKlHh/5AF4CuBHgmmjJ3IJEX.Uox9fAYePuh1DSDyrG', 'd', 'd', 'd', 'd', 'd', 'd', NULL, '2025-06-20 16:51:39', 0, '2025-06-20 16:51:39'),
(131, 'jo', 'sa', 16, 'tr', 'joh@hotmail.fr', '$2y$10$uQpJ/vRj2vjVP4MRotHVQu0D5Gknq6McRo1LuD8.RrcMgM3ikLQuy', 'g', 'g', 'g', 'g', 'g', 'g', NULL, '2025-06-20 16:58:24', 0, '2025-06-20 16:58:24'),
(132, 'Johnny', 'Sassiat', 16, 'paris', 'jo@ho.fr', '$2y$10$YgW8YtUNPFekiqppYLg36e1e9988cflVPgNpVRYTGZM7SxHBF4dzq', 'a', 'a', 'a', 'a', 'a', 'a', NULL, '2025-06-20 17:03:35', 0, '2025-06-20 17:03:35'),
(133, 'johnny', 'sassiat', 18, 'a', 'aa@a.com', '$2y$10$9m0mITHfRiyZLTbLB/OlnuVR0xxYa2pREj3azP8N6NkV8LhKP26W.', 'e', 'e', 'e', 'e', 'e', 'e', NULL, '2025-06-20 17:06:46', 1, '2025-06-20 17:06:46'),
(134, 'j', 's', 18, 'a', 'a@a.fr', '$2y$10$olhV3mvsqixv5xPaaBLYF.zOLFR6avVPybrzlXAK..ShrVN3zAcUu', 'a', 'a', 'a', 'a', 'a', 'a', 'photo/685595e88e052Toriyama_DQ_Illustrations.webp', '2025-06-20 17:10:04', 1, '2025-06-20 17:10:04');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `abonnement`
--
ALTER TABLE `abonnement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `dislikes`
--
ALTER TABLE `dislikes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dislike` (`dislike_id`,`disliked_id`),
  ADD KEY `disliked_id` (`disliked_id`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`liker_id`,`liked_id`),
  ADD KEY `fk_liked` (`liked_id`);

--
-- Index pour la table `matchs`
--
ALTER TABLE `matchs`
  ADD UNIQUE KEY `user1_id` (`user1_id`,`user2_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `abonnement`
--
ALTER TABLE `abonnement`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `dislikes`
--
ALTER TABLE `dislikes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=875;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=572;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `abonnement`
--
ALTER TABLE `abonnement`
  ADD CONSTRAINT `abonnement_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `dislikes`
--
ALTER TABLE `dislikes`
  ADD CONSTRAINT `dislikes_ibfk_1` FOREIGN KEY (`disliked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dislikes_ibfk_2` FOREIGN KEY (`dislike_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_liked` FOREIGN KEY (`liked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_liker` FOREIGN KEY (`liker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
