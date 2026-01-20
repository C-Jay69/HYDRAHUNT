'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.start_hunting': 'Start Hunting',
    'nav.view_plans': 'View Plans',
    'nav.dashboard': 'Dashboard',
    'nav.upgrade': 'Upgrade Clearance',

    // Hero
    'hero.title1': 'CAREER WARFARE',
    'hero.title2': 'AUTOMATE YOUR HUNT',
    'hero.desc': 'Transform messy career data into precision-striking resumes. Let multiple AI heads scour, match, and apply to jobs while you sleep.',
    'hero.cta_main': 'START HUNTING',
    'hero.cta_sec': 'VIEW PLANS',

    // Features
    'features.title': 'TURN CHAOS INTO CAREER DOMINANCE',
    'feature.resume.title': 'Killer Resume',
    'feature.resume.desc': 'Transform messy documents into employer-melting resumes that strike hard and land interviews.',
    'feature.analysis.title': 'Career Analysis',
    'feature.analysis.desc': 'Analyze your fit for any role. Know your strengths, weaknesses, and exactly how to pivot.',
    'feature.autohunt.title': 'Auto-Hunt',
    'feature.autohunt.desc': 'Multiple heads scouring, matching, and striking job applications automatically while you sleep.',
    'feature.transition.title': 'Transition Maps',
    'feature.transition.desc': 'Plot complete career transitions with skill roadmaps and course recommendations that claim new territory.',
    'feature.vault.title': 'Version Vault',
    'feature.vault.desc': 'Every iteration stored, accessible, and ready to upgrade anytime you need a sharper weapon.',

    // How it Works
    'howitworks.title': 'HOW HYDRA HUNTS FOR YOU',
    'step01.title': 'Feed the Beast',
    'step01.desc': 'PDFs, TXT files, random notes, bullet dumps — Hydra eats everything. Your messy career history becomes structured intelligence in seconds. No formatting required.',
    'step02.title': 'Forge Your Weapon',
    'step02.desc': 'A polished, professional, employer-melting resume emerges. Plus deep analysis, weakness identification, improvement recommendations — everything you need to strike harder.',
    'step03.title': 'Unleash the Hunt',
    'step03.desc': 'Job scouting, matching, applying. Multiple heads tracking multiple targets simultaneously. You just show up for the interviews and collect offers.',

    // Deep Dives
    'deepdive.resume_forge.title': 'RESUME FORGE:',
    'deepdive.resume_forge.subtitle': 'RAW INFO → WEAPONIZED OUTPUT',
    'deepdive.resume_forge.desc': 'Feed Hydra your scattered career history and watch it transform into a precision-engineered resume that hiring managers can\'t ignore. Every word optimized. Every bullet point sharpened. Every section strategically positioned to maximize your impact and land you in the interview chair.',
    'deepdive.resume_forge.parsing': 'Intelligent parsing',
    'deepdive.resume_forge.parsing_desc': 'Extracts key achievements, skills, and experience from any format',
    'deepdive.resume_forge.optimization': 'Industry optimization',
    'deepdive.resume_forge.optimization_desc': 'Tailors language and keywords for your target sector',
    'deepdive.resume_forge.ats': 'ATS-proof formatting',
    'deepdive.resume_forge.ats_desc': 'Guaranteed to pass automated screening systems',

    'deepdive.strike_analysis.title': 'STRIKE ANALYSIS:',
    'deepdive.strike_analysis.subtitle': 'KNOW YOUR WEAKNESSES BEFORE EMPLOYERS DO',
    'deepdive.strike_analysis.desc': 'Hydra evaluates your resume like a ruthless hiring manager and tells you exactly how to hit harder. Get brutal, actionable feedback on gaps, weak points, and missed opportunities. Then watch as Hydra shows you precisely how to transform every weakness into a strength.',
    'deepdive.strike_analysis.gap': 'Gap analysis: Identify missing skills and experience',
    'deepdive.strike_analysis.language': 'Language audit: Replace weak verbs with power statements',
    'deepdive.strike_analysis.achievement': 'Achievement quantification: Add metrics that prove impact',
    'deepdive.strike_analysis.positioning': 'Competitive positioning: Stand out in your field',

    // Auto-Hunt Engine
    'autohunt.title': 'AUTO-HUNT ENGINE:',
    'autohunt.subtitle': 'YOUR 24/7 JOB-SEEKING MACHINE',
    'autohunt.scour': 'Scours the Web',
    'autohunt.scour_desc': 'Hydra searches thousands of job boards, company sites, and hidden listings simultaneously',
    'autohunt.match': 'Matches Skills',
    'autohunt.match_desc': 'AI algorithms identify perfect-fit opportunities based on your profile and career goals',
    'autohunt.strike': 'Strikes Fast',
    'autohunt.strike_desc': 'When prey is spotted, Hydra strikes automatically with optimized applications',

    // Pricing
    'pricing.title': 'CHOOSE YOUR WEAPON',
    'pricing.desc': 'No contracts. No nonsense. Just results.',
    'pricing.scout': 'SCOUT MODE',
    'pricing.scout_desc': 'For curious hunters',
    'pricing.scout_feature1': '1 Resume Forged',
    'pricing.scout_feature2': 'Basic Templates',
    'pricing.scout_feature3': 'Resume Forge',
    'pricing.scout_cta': 'START SCOUTING',
    'pricing.hunter': 'HUNTER MODE',
    'pricing.hunter_desc': 'Serious firepower',
    'pricing.hunter_feature1': 'Unlimited Resumes',
    'pricing.hunter_feature2': 'Full Strike Analysis',
    'pricing.hunter_feature3': 'AI-Fueled Editing',
    'pricing.hunter_feature4': '30 Auto-Strikes/Day',
    'pricing.hunter_cta': 'ACTIVATE HUNTER',
    'pricing.hydra': 'HYDRA MODE',
    'pricing.hydra_desc': 'For the unstoppable',
    'pricing.hydra_feature1': 'Everything in Hunter',
    'pricing.hydra_feature2': 'Unlimited Auto-Strikes',
    'pricing.hydra_feature3': 'Career Territory Mapping',
    'pricing.hydra_feature4': 'Priority Queue',
    'pricing.hydra_cta': 'UNLEASH HYDRA',

    // Login
    'login.title': 'ACCESS MAINFRAME',
    'login.subtitle': 'Identify yourself to proceed.',
    'login.email': 'EMAIL ADDRESS',
    'login.password': 'PASSWORD',
    'login.magic_link': 'SEND MAGIC LINK',
    'login.signup_link': 'CREATE ID',
    'login.or': 'OR AUTH WITH',
    'login.google': 'Google Account',
    'login.no_account': "Don't have an account?",
    'login.signup': 'Sign up',
    'login.have_account': 'Already have an account?',
    'login.signin': 'Sign in',

    // Signup
    'signup.title': 'INITIATE SEQUENCE',
    'signup.subtitle': 'Create your agent profile.',
    'signup.fullname': 'FULL NAME',
    'signup.email': 'EMAIL ADDRESS',
    'signup.password': 'PASSWORD',
    'signup.confirm_password': 'CONFIRM PASSWORD',
    'signup.create': 'CREATE ACCOUNT',
    'signup.terms': 'By creating an account, you agree to our Terms of Service and Privacy Policy.',

    // Footer
    'footer.tagline': 'Career Warfare AI Platform',
    'footer.copyright': '© 2024 HydraHunt. All rights reserved.',
  },

  es: {
    // Navigation
    'nav.start_hunting': 'Comenzar a Cazar',
    'nav.view_plans': 'Ver Planes',
    'nav.dashboard': 'Panel de Control',
    'nav.upgrade': 'Mejorar Permiso',

    // Hero
    'hero.title1': 'GUERRA DE CARRERA',
    'hero.title2': 'AUTOMATIZA TU BÚSQUEDA',
    'hero.desc': 'Transforma datos de carrera desorganizados en currículums de precisión letal. Deja que múltiples cabezas IA busquen, combinen y apliquen a trabajos mientras duermes.',
    'hero.cta_main': 'COMENZAR A CAZAR',
    'hero.cta_sec': 'VER PLANES',

    // Features
    'features.title': 'CONVIERTE EL CAOS EN DOMINIO DE CARRERA',
    'feature.resume.title': 'Currículum Mortal',
    'feature.resume.desc': 'Transforma documentos desordenados en currículums que impactan y consiguen entrevistas.',
    'feature.analysis.title': 'Análisis de Carrera',
    'feature.analysis.desc': 'Analiza tu aptitud para cualquier rol. Conoce tus fortalezas, debilidades y exactamente cómo pivotar.',
    'feature.autohunt.title': 'Auto-Caza',
    'feature.autohunt.desc': 'Múltiples cabezas buscando, emparejando y aplicando automáticamente a trabajos mientras duermes.',
    'feature.transition.title': 'Mapas de Transición',
    'feature.transition.desc': 'Planifica transiciones completas de carrera con rutas de habilidades y recomendaciones de cursos que reclamen nuevo territorio.',
    'feature.vault.title': 'Bóveda de Versiones',
    'feature.vault.desc': 'Cada iteración almacenada, accesible y lista para actualizar cuando necesites un arma más afilada.',

    // How it Works
    'howitworks.title': 'CÓMO HYDRA CAZA PARA TI',
    'step01.title': 'Alimenta a la Bestia',
    'step01.desc': 'PDFs, archivos TXT, notas aleatorias, listas de viñetas — Hydra se come todo. Tu historia de carrera desordenada se convierte en inteligencia estructurada en segundos. Sin formato requerido.',
    'step02.title': 'Forja Tu Arma',
    'step02.desc': 'Un currículum profesional, pulido y letal emerge. Además análisis profundo, identificación de debilidades, recomendaciones de mejora — todo lo que necesitas para atacar más fuerte.',
    'step03.title': 'Desata la Caza',
    'step03.desc': 'Búsqueda de trabajo, emparejamiento, aplicación. Múltiples cabezas rastreando múltiples objetivos simultáneamente. Solo apareces a las entrevistas y recolectas ofertas.',

    // Deep Dives
    'deepdive.resume_forge.title': 'FORJA DE CURRÍCULUM:',
    'deepdive.resume_forge.subtitle': 'INFO BRUTA → SALIDA ARMADA',
    'deepdive.resume_forge.desc': 'Alimenta a Hydra con tu historia de carrera dispersa y mira cómo se transforma en un currículum de precisión ingenierizada que los gerentes de contratación no pueden ignorar. Cada palabra optimizada. Cada punto de viñeta afilado. Cada sección posicionada estratégicamente para maximizar tu impacto y llevarte a la silla de entrevista.',
    'deepdive.resume_forge.parsing': 'Análisis inteligente',
    'deepdive.resume_forge.parsing_desc': 'Extrae logros clave, habilidades y experiencia de cualquier formato',
    'deepdive.resume_forge.optimization': 'Optimización de industria',
    'deepdive.resume_forge.optimization_desc': 'Adapta lenguaje y palabras clave para tu sector objetivo',
    'deepdive.resume_forge.ats': 'Formato a prueba de ATS',
    'deepdive.resume_forge.ats_desc': 'Garantizado para pasar sistemas de detección automatizados',

    'deepdive.strike_analysis.title': 'ANÁLISIS DE ATAQUE:',
    'deepdive.strike_analysis.subtitle': 'CONOCE TUS DEBILIDADES ANTES QUE LOS EMPLEADORES',
    'deepdive.strike_analysis.desc': 'Hydra evalúa tu currículum como un gerente de contratación despiadado y te dice exactamente cómo atacar más fuerte. Obtén retroalimentación brutal y accionable sobre brechas, puntos débiles y oportunidades perdidas. Luego observa mientras Hydra te muestra precisamente cómo transformar cada debilidad en fortaleza.',
    'deepdive.strike_analysis.gap': 'Análisis de brechas: Identifica habilidades y experiencia faltantes',
    'deepdive.strike_analysis.language': 'Auditoría de lenguaje: Reemplaza verbos débiles con declaraciones poderosas',
    'deepdive.strike_analysis.achievement': 'Cuantificación de logros: Añade métricas que prueben impacto',
    'deepdive.strike_analysis.positioning': 'Posicionamiento competitivo: Destaca en tu campo',

    // Auto-Hunt Engine
    'autohunt.title': 'MOTOR DE AUTO-CAZA:',
    'autohunt.subtitle': 'TU MÁQUINA DE BÚSQUEDA DE EMPLEO 24/7',
    'autohunt.scour': 'Explora la Web',
    'autohunt.scour_desc': 'Hydra busca miles de tablones de trabajo, sitios de empresas y listados ocultos simultáneamente',
    'autohunt.match': 'Empareja Habilidades',
    'autohunt.match_desc': 'Los algoritmos de IA identifican oportunidades de ajuste perfecto basadas en tu perfil y objetivos de carrera',
    'autohunt.strike': 'Ataca Rápido',
    'autohunt.strike_desc': 'Cuando se detecta presa, Hydra ataca automáticamente con aplicaciones optimizadas',

    // Pricing
    'pricing.title': 'ELIGE TU ARMA',
    'pricing.desc': 'Sin contratos. Sin tonterías. Solo resultados.',
    'pricing.scout': 'MODO EXPLORADOR',
    'pricing.scout_desc': 'Para cazadores curiosos',
    'pricing.scout_feature1': '1 Currículum Forjado',
    'pricing.scout_feature2': 'Plantillas Básicas',
    'pricing.scout_feature3': 'Forja de Currículum',
    'pricing.scout_cta': 'COMENZAR EXPLORACIÓN',
    'pricing.hunter': 'MODO CAZADOR',
    'pricing.hunter_desc': 'Poderío serio',
    'pricing.hunter_feature1': 'Currículums Ilimitados',
    'pricing.hunter_feature2': 'Análisis Completo de Ataque',
    'pricing.hunter_feature3': 'Edición con IA',
    'pricing.hunter_feature4': '30 Auto-Ataques/Día',
    'pricing.hunter_cta': 'ACTIVAR CAZADOR',
    'pricing.hydra': 'MODO HIDRA',
    'pricing.hydra_desc': 'Para lo imparable',
    'pricing.hydra_feature1': 'Todo en Cazador',
    'pricing.hydra_feature2': 'Auto-Ataques Ilimitados',
    'pricing.hydra_feature3': 'Mapeo de Territorio de Carrera',
    'pricing.hydra_feature4': 'Cola Prioritaria',
    'pricing.hydra_cta': 'LIBERAR HIDRA',

    // Login
    'login.title': 'ACCEDER AL NÚCLEO',
    'login.subtitle': 'Identifícate para proceder.',
    'login.email': 'DIRECCIÓN DE CORREO',
    'login.password': 'CONTRASEÑA',
    'login.magic_link': 'ENVIAR ENLACE MÁGICO',
    'login.signup_link': 'CREAR ID',
    'login.or': 'O AUTENTICAR CON',
    'login.google': 'Cuenta de Google',
    'login.no_account': '¿No tienes una cuenta?',
    'login.signup': 'Regístrate',
    'login.have_account': '¿Ya tienes una cuenta?',
    'login.signin': 'Inicia sesión',

    // Signup
    'signup.title': 'INICIAR SECUENCIA',
    'signup.subtitle': 'Crea tu perfil de agente.',
    'signup.fullname': 'NOMBRE COMPLETO',
    'signup.email': 'DIRECCIÓN DE CORREO',
    'signup.password': 'CONTRASEÑA',
    'signup.confirm_password': 'CONFIRMAR CONTRASEÑA',
    'signup.create': 'CREAR CUENTA',
    'signup.terms': 'Al crear una cuenta, aceptas nuestros Términos de Servicio y Política de Privacidad.',

    // Footer
    'footer.tagline': 'Plataforma de IA de Guerra de Carrera',
    'footer.copyright': '© 2024 HydraHunt. Todos los derechos reservados.',
  },

  fr: {
    // Navigation
    'nav.start_hunting': 'Commencer la Chasse',
    'nav.view_plans': 'Voir les Plans',
    'nav.dashboard': 'Tableau de Bord',
    'nav.upgrade': 'Améliorer l\'Accès',

    // Hero
    'hero.title1': 'GUERRE DE CARRIÈRE',
    'hero.title2': 'AUTOMATISEZ VOTRE CHASSE',
    'hero.desc': 'Transformez des données de carrière désorganisées en CVs de précision meurtrière. Laissez plusieurs têtes IA rechercher, faire correspondre et postuler à des emplois pendant que vous dormez.',
    'hero.cta_main': 'COMMENCER LA CHASSE',
    'hero.cta_sec': 'VOIR LES PLANS',

    // Features
    'features.title': 'TRANSFORMEZ LE CHAOS EN DOMINATION DE CARRIÈRE',
    'feature.resume.title': 'CV Meurtrier',
    'feature.resume.desc': 'Transformez des documents désorganisés en CVs qui frappent fort et décrochent des entretiens.',
    'feature.analysis.title': 'Analyse de Carrière',
    'feature.analysis.desc': 'Analysez votre adéquation à tout rôle. Connaissez vos forces, faiblesses et exactement comment pivoter.',
    'feature.autohunt.title': 'Auto-Chasse',
    'feature.autohunt.desc': 'Plusieurs têtes recherchant, faisant correspondre et appliquant automatiquement à des emplois pendant que vous dormez.',
    'feature.transition.title': 'Cartes de Transition',
    'feature.transition.desc': 'Planifiez des transitions complètes de carrière avec des feuilles de route de compétences et des recommandations de cours qui revendiquent un nouveau territoire.',
    'feature.vault.title': 'Coffre de Versions',
    'feature.vault.desc': 'Chaque itération stockée, accessible et prête à améliorer à tout moment quand vous avez besoin d\'une arme plus affilée.',

    // How it Works
    'howitworks.title': 'COMMENT HYDRA CHASSE POUR VOUS',
    'step01.title': 'Nourrissez la Bête',
    'step01.desc': 'PDFs, fichiers TXT, notes aléatoires, listes à puces — Hydra mange tout. Votre histoire de carrière désorganisée devient intelligence structurée en secondes. Aucun format requis.',
    'step02.title': 'Forgez Votre Arme',
    'step02.desc': 'Un CV professionnel, poli et meurtrier émerge. Plus analyse approfondie, identification des faiblesses, recommandations d\'amélioration — tout ce dont vous avez besoin pour frapper plus fort.',
    'step03.title': 'Déchaînez la Chasse',
    'step03.desc': 'Recherche d\'emploi, correspondance, application. Plusieurs têtes traquant plusieurs cibles simultanément. Vous venez juste aux entretiens et collectez des offres.',

    // Deep Dives
    'deepdive.resume_forge.title': 'FORGE DE CV:',
    'deepdive.resume_forge.subtitle': 'INFO BRUTE → SORTIE ARMÉE',
    'deepdive.resume_forge.desc': 'Nourrissez Hydra avec votre histoire de carrière dispersée et regardez comment elle se transforme en un CV d\'ingénierie de précision que les recruteurs ne peuvent pas ignorer. Chaque mot optimisé. Chaque puce affilée. Chaque section positionnée stratégiquement pour maximiser votre impact et vous mener à la chaise d\'entretien.',
    'deepdive.resume_forge.parsing': 'Analyse intelligente',
    'deepdive.resume_forge.parsing_desc': 'Extrait les réalisations clés, compétences et expérience de tout format',
    'deepdive.resume_forge.optimization': 'Optimisation d\'industrie',
    'deepdive.resume_forge.optimization_desc': 'Adapte le langage et les mots-clés pour votre secteur cible',
    'deepdive.resume_forge.ats': 'Formatage à l\'épreuve ATS',
    'deepdive.resume_forge.ats_desc': 'Garanti pour passer les systèmes de sélection automatisés',

    'deepdive.strike_analysis.title': 'ANALYSE DE FRAPPE:',
    'deepdive.strike_analysis.subtitle': 'CONNAISSEZ VOS FAIBLESSES AVANT LES RECRUTEURS',
    'deepdive.strike_analysis.desc': 'Hydra évalue votre CV comme un recruteur impitoyable et vous dit exactement comment frapper plus fort. Obtenez une réaction brutale et actionnable sur les écarts, points faibles et opportunités manquées. Ensuite regardez comment Hydra vous montre précisément comment transformer chaque faiblesse en force.',
    'deepdive.strike_analysis.gap': 'Analyse des écarts: Identifie les compétences et l\'expérience manquantes',
    'deepdive.strike_analysis.language': 'Audit de langage: Remplacez les verbes faibles par des déclarations puissantes',
    'deepdive.strike_analysis.achievement': 'Quantification des réalisations: Ajoutez des mesures qui prouvent l\'impact',
    'deepdive.strike_analysis.positioning': 'Positionnement concurrentiel: Démarquez-vous dans votre domaine',

    // Auto-Hunt Engine
    'autohunt.title': 'MOTEUR DE AUTO-CHASSE:',
    'autohunt.subtitle': 'VOTRE MACHINE DE RECHERCHE D\'EMPLOI 24/7',
    'autohunt.scour': 'Fouille le Web',
    'autohunt.scour_desc': 'Hydra cherche des milliers de sites d\'emploi, sites d\'entreprise et listages cachés simultanément',
    'autohunt.match': 'Fait Correspondre les Compétences',
    'autohunt.match_desc': 'Les algorithmes IA identifient des opportunités d\'ajustement parfaites basées sur votre profil et objectifs de carrière',
    'autohunt.strike': 'Frappe Vite',
    'autohunt.strike_desc': 'Quand une proie est repérée, Hydra frappe automatiquement avec des applications optimisées',

    // Pricing
    'pricing.title': 'CHOISISSEZ VOTRE ARME',
    'pricing.desc': 'Sans contrats. Sans bêtises. Juste des résultats.',
    'pricing.scout': 'MODE ÉCLAIREUR',
    'pricing.scout_desc': 'Pour les chasseurs curieux',
    'pricing.scout_feature1': '1 CV Forgé',
    'pricing.scout_feature2': 'Modèles de Base',
    'pricing.scout_feature3': 'Forge de CV',
    'pricing.scout_cta': 'COMMENCER L\'EXPLORATION',
    'pricing.hunter': 'MODE CHASSEUR',
    'pricing.hunter_desc': 'Puissance sérieuse',
    'pricing.hunter_feature1': 'CV Illimités',
    'pricing.hunter_feature2': 'Analyse de Frappe Complète',
    'pricing.hunter_feature3': 'Édition par IA',
    'pricing.hunter_feature4': '30 Auto-Frappes/Jour',
    'pricing.hunter_cta': 'ACTIVER CHASSEUR',
    'pricing.hydra': 'MODE HYDRA',
    'pricing.hydra_desc': 'Pour l\'imparable',
    'pricing.hydra_feature1': 'Tout dans Chasseur',
    'pricing.hydra_feature2': 'Auto-Frappes Illimitées',
    'pricing.hydra_feature3': 'Cartographie de Territoire de Carrière',
    'pricing.hydra_feature4': 'File Prioritaire',
    'pricing.hydra_cta': 'LIBÉRER HYDRA',

    // Login
    'login.title': 'ACCÉDER AU NOYAU',
    'login.subtitle': 'Identifiez-vous pour procéder.',
    'login.email': 'ADRESSE E-MAIL',
    'login.password': 'MOT DE PASSE',
    'login.magic_link': 'ENVOYER LIEN MAGIQUE',
    'login.signup_link': 'CRÉER ID',
    'login.or': 'OU AUTHENTIFIER AVEC',
    'login.google': 'Compte Google',
    'login.no_account': 'Vous n\'avez pas de compte?',
    'login.signup': 'S\'inscrire',
    'login.have_account': 'Vous avez déjà un compte?',
    'login.signin': 'Se connecter',

    // Signup
    'signup.title': 'INITIER SÉQUENCE',
    'signup.subtitle': 'Créez votre profil d\'agent.',
    'signup.fullname': 'NOM COMPLET',
    'signup.email': 'ADRESSE E-MAIL',
    'signup.password': 'MOT DE PASSE',
    'signup.confirm_password': 'CONFIRMER MOT DE PASSE',
    'signup.create': 'CRÉER COMPTE',
    'signup.terms': 'En créant un compte, vous acceptez nos Conditions d\'Utilisation et Politique de Confidentialité.',

    // Footer
    'footer.tagline': 'Plateforme d\'IA de Guerre de Carrière',
    'footer.copyright': '© 2024 HydraHunt. Tous droits réservés.',
  },

  zh: {
    // Navigation
    'nav.start_hunting': '开始狩猎',
    'nav.view_plans': '查看计划',
    'nav.dashboard': '控制面板',
    'nav.upgrade': '升级权限',

    // Hero
    'hero.title1': '职业战争',
    'hero.title2': '自动化你的求职',
    'hero.desc': '将混乱的职业数据转化为精确打击的简历。让多个AI头部在你睡觉时搜索、匹配并申请工作。',
    'hero.cta_main': '开始狩猎',
    'hero.cta_sec': '查看计划',

    // Features
    'features.title': '将混乱转化为职业主导',
    'feature.resume.title': '杀手级简历',
    'feature.resume.desc': '将杂乱的文档转化为雇主无法忽视的简历，强力打击并获得面试机会。',
    'feature.analysis.title': '职业分析',
    'feature.analysis.desc': '分析您在任何职位上的适配度。了解您的优势、劣势以及如何转型。',
    'feature.autohunt.title': '自动狩猎',
    'feature.autohunt.desc': '多个头部在你睡觉时自动搜索、匹配和申请工作。',
    'feature.transition.title': '转型地图',
    'feature.transition.desc': '规划完整的职业转型，包括技能路线图和课程推荐，占领新领域。',
    'feature.vault.title': '版本库',
    'feature.vault.desc': '每次迭代都已存储、可访问，随时可以升级为您需要更锋利的武器。',

    // How it Works
    'howitworks.title': 'HYDRA如何为你狩猎',
    'step01.title': '喂养野兽',
    'step01.desc': 'PDF、TXT文件、随机笔记、要点列表——Hydra吃下一切。您混乱的职业历史在几秒钟内转化为结构化的智能。无需格式化。',
    'step02.title': '锻造你的武器',
    'step02.desc': '一份专业、精致、致命的简历 emerges。加上深度分析、弱点识别、改进建议——一切您需要更强烈地打击。',
    'step03.title': '释放狩猎',
    'step03.desc': '工作搜索、匹配、申请。多个头部同时跟踪多个目标。您只需参加面试并收集offer。',

    // Deep Dives
    'deepdive.resume_forge.title': '简历锻造：',
    'deepdive.resume_forge.subtitle': '原始信息 → 武器化输出',
    'deepdive.resume_forge.desc': '将您分散的职业历史喂给Hydra，看着它转化为招聘经理无法忽视的精密工程简历。每个词都优化。每个要点都锐利。每个部分都战略定位以最大化您的影响并让您进入面试椅。',
    'deepdive.resume_forge.parsing': '智能解析',
    'deepdive.resume_forge.parsing_desc': '从任何格式中提取关键成就、技能和经验',
    'deepdive.resume_forge.optimization': '行业优化',
    'deepdive.resume_forge.optimization_desc': '为您的目标行业定制语言和关键词',
    'deepdive.resume_forge.ats': 'ATS安全格式',
    'deepdive.resume_forge.ats_desc': '保证通过自动筛选系统',

    'deepdive.strike_analysis.title': '打击分析：',
    'deepdive.strike_analysis.subtitle': '在雇主之前了解你的弱点',
    'deepdive.strike_analysis.desc': 'Hydra像无情的招聘经理一样评估您的简历，并告诉您如何更强烈地打击。获得关于差距、弱点点和错失机会的残酷、可操作的反馈。然后观看Hydra向您展示如何将每个弱点转化为优势。',
    'deepdive.strike_analysis.gap': '差距分析：识别缺失的技能和经验',
    'deepdive.strike_analysis.language': '语言审计：用强有力的陈述替换弱动词',
    'deepdive.strike_analysis.achievement': '成就量化：添加证明影响的指标',
    'deepdive.strike_analysis.positioning': '竞争定位：在您的领域脱颖而出',

    // Auto-Hunt Engine
    'autohunt.title': '自动狩猎引擎：',
    'autohunt.subtitle': '您的24/7求职机器',
    'autohunt.scour': '搜索网络',
    'autohunt.scour_desc': 'Hydra同时搜索数千个工作板、公司网站和隐藏的列表',
    'autohunt.match': '匹配技能',
    'autohunt.match_desc': 'AI算法根据您的档案和职业目标识别完美的机会',
    'autohunt.strike': '快速打击',
    'autohunt.strike_desc': '当发现目标时，Hydra自动使用优化的应用程序进行打击',

    // Pricing
    'pricing.title': '选择你的武器',
    'pricing.desc': '无合同。无废话。只有结果。',
    'pricing.scout': '侦察模式',
    'pricing.scout_desc': '适合好奇的猎人',
    'pricing.scout_feature1': '1份锻造的简历',
    'pricing.scout_feature2': '基本模板',
    'pricing.scout_feature3': '简历锻造',
    'pricing.scout_cta': '开始侦察',
    'pricing.hunter': '猎人模式',
    'pricing.hunter_desc': '真正的火力',
    'pricing.hunter_feature1': '无限简历',
    'pricing.hunter_feature2': '完整打击分析',
    'pricing.hunter_feature3': 'AI驱动编辑',
    'pricing.hunter_feature4': '每天30次自动打击',
    'pricing.hunter_cta': '激活猎人',
    'pricing.hydra': 'HYDRA模式',
    'pricing.hydra_desc': '对于不可阻挡的人',
    'pricing.hydra_feature1': '猎人模式所有功能',
    'pricing.hydra_feature2': '无限自动打击',
    'pricing.hydra_feature3': '职业领域映射',
    'pricing.hydra_feature4': '优先队列',
    'pricing.hydra_cta': '释放HYDRA',

    // Login
    'login.title': '访问核心',
    'login.subtitle': '确认身份以继续。',
    'login.email': '电子邮件地址',
    'login.password': '密码',
    'login.magic_link': '发送魔法链接',
    'login.signup_link': '创建ID',
    'login.or': '或使用以下方式验证',
    'login.google': 'Google账户',
    'login.no_account': '没有账户？',
    'login.signup': '注册',
    'login.have_account': '已有账户？',
    'login.signin': '登录',

    // Signup
    'signup.title': '启动序列',
    'signup.subtitle': '创建您的特工档案。',
    'signup.fullname': '全名',
    'signup.email': '电子邮件地址',
    'signup.password': '密码',
    'signup.confirm_password': '确认密码',
    'signup.create': '创建账户',
    'signup.terms': '通过创建账户，您同意我们的服务条款和隐私政策。',

    // Footer
    'footer.tagline': '职业战争AI平台',
    'footer.copyright': '© 2024 HydraHunt。保留所有权利。',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
