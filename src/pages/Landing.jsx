import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Sparkles,
  Rocket,
  Brain,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Star,
  Play,
  Calendar,
  Trophy,
  Check,
  Plus,
  Mail,
  User,
  UserCheck,
  LayoutDashboard,
  Compass,
  Smile,
  Flame,
  ChevronRight,
  BookOpenCheck
} from 'lucide-react';

// Custom Claymorphic SVGs for Student Avatars (instead of emojis)
const AvatarSVG1 = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#F472B6" stroke="#1E1B4B" strokeWidth="4" />
    <circle cx="50" cy="50" r="35" fill="#FBCFE8" />
    <circle cx="38" cy="45" r="5" fill="#1E1B4B" />
    <circle cx="62" cy="45" r="5" fill="#1E1B4B" />
    <path d="M 35 60 Q 50 75 65 60" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="30" cy="55" r="3" fill="#F472B6" opacity="0.6" />
    <circle cx="70" cy="55" r="3" fill="#F472B6" opacity="0.6" />
  </svg>
);

const AvatarSVG2 = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#60A5FA" stroke="#1E1B4B" strokeWidth="4" />
    <circle cx="50" cy="50" r="35" fill="#DBEAFE" />
    {/* Cute Glasses */}
    <rect x="25" y="38" width="20" height="15" rx="5" fill="none" stroke="#1E1B4B" strokeWidth="4" />
    <rect x="55" y="38" width="20" height="15" rx="5" fill="none" stroke="#1E1B4B" strokeWidth="4" />
    <line x1="45" y1="45" x2="55" y2="45" stroke="#1E1B4B" strokeWidth="4" />
    <circle cx="35" cy="45" r="3" fill="#1E1B4B" />
    <circle cx="65" cy="45" r="3" fill="#1E1B4B" />
    <path d="M 40 62 Q 50 68 60 62" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

const AvatarSVG3 = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#34D399" stroke="#1E1B4B" strokeWidth="4" />
    <circle cx="50" cy="50" r="35" fill="#D1FAE5" />
    <circle cx="38" cy="45" r="5" fill="#1E1B4B" />
    <circle cx="62" cy="45" r="5" fill="#1E1B4B" />
    {/* Cute teeth smile */}
    <path d="M 38 58 Q 50 72 62 58" fill="#1E1B4B" />
    <rect x="46" y="58" width="8" height="5" fill="white" />
  </svg>
);

const AvatarSVG4 = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="4" />
    <circle cx="50" cy="50" r="35" fill="#FEF3C7" />
    <circle cx="35" cy="45" r="4" fill="#1E1B4B" />
    <circle cx="65" cy="45" r="4" fill="#1E1B4B" />
    {/* Wink eye */}
    <path d="M 30 45 Q 35 40 40 45" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 38 60 Q 50 70 62 60" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 45 30 Q 50 20 55 30" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

export default function Landing() {
  // Course State & Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Space Explorer 101',
      category: 'Science',
      color: 'sky',
      bgClass: 'clay-card-sky',
      badgeColor: 'bg-sky-400 text-sky-950',
      description: 'Embark on an interactive journey through the solar system. Discover planets, moons, and stardust!',
      duration: '6 weeks',
      rating: 4.9,
      reviews: 128,
      students: 1240,
      instructor: 'Dr. Nova Spark',
      enrolled: false
    },
    {
      id: 2,
      title: 'Creative Storytelling',
      category: 'Creative',
      color: 'pink',
      bgClass: 'clay-card-pink text-white',
      badgeColor: 'bg-pink-300 text-pink-950',
      description: 'Learn to build worlds, create characters, and write your very first comic book with easy guidelines.',
      duration: '4 weeks',
      rating: 4.8,
      reviews: 94,
      students: 850,
      instructor: 'Lily Quill',
      enrolled: false
    },
    {
      id: 3,
      title: 'Magic Math Quest',
      category: 'Math',
      color: 'yellow',
      bgClass: 'clay-card-yellow',
      badgeColor: 'bg-yellow-400 text-yellow-950',
      description: 'Master addition, subtraction, and secret arithmetic spells through dungeon puzzles and quests.',
      duration: '5 weeks',
      rating: 4.7,
      reviews: 215,
      students: 3110,
      instructor: 'Wizard Abacus',
      enrolled: false
    },
    {
      id: 4,
      title: 'Robotics for Tiny Humans',
      category: 'Coding',
      color: 'purple',
      bgClass: 'clay-card-purple',
      badgeColor: 'bg-violet-400 text-violet-950',
      description: 'Build virtual robots and control them using block code. No prior coding experience required!',
      duration: '8 weeks',
      rating: 5.0,
      reviews: 310,
      students: 1560,
      instructor: 'Byte Bot',
      enrolled: false
    },
    {
      id: 5,
      title: 'Supercharged Chemistry',
      category: 'Science',
      color: 'green',
      bgClass: 'clay-card-green',
      badgeColor: 'bg-emerald-400 text-emerald-950',
      description: 'Create bubbly explosions and safe lab reactions in your browser. Colorful, messy, and fun!',
      duration: '5 weeks',
      rating: 4.9,
      reviews: 142,
      students: 980,
      instructor: 'Prof. Fizzy Glass',
      enrolled: false
    }
  ]);

  // Progress Tracking Widget State
  const [xp, setXp] = useState(180);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(4);
  const [streakChecked, setStreakChecked] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Read 2 pages of Space Stories', xp: 30, done: false },
    { id: 2, text: 'Solve 5 magic math puzzles', xp: 40, done: true },
    { id: 3, text: 'Build simple virtual robot code', xp: 50, done: false }
  ]);

  // Enrollment Form State
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    childAge: '',
    interest: 'Coding',
    email: ''
  });

  const categories = ['All', 'Science', 'Math', 'Creative', 'Coding'];

  // Handle Enrollment Toggle
  const handleEnrollCourse = (id) => {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          if (!c.enrolled) {
            Swal.fire({
              title: 'Hooray! 🎉',
              text: `You have successfully enrolled in "${c.title}"! Welcome aboard!`,
              icon: 'success',
              confirmButtonText: 'Let\'s Go!',
              confirmButtonColor: '#F97316',
              background: '#EEF2FF',
              customClass: {
                popup: 'rounded-[24px] border-4 border-[#1E1B4B] shadow-[8px_8px_0px_#1E1B4B]',
                confirmButton: 'clay-btn-orange font-fredoka px-6 py-3 font-semibold'
              }
            });
            // Grant 50 XP
            handleGainXp(50);
            return { ...c, enrolled: true, students: c.students + 1 };
          } else {
            Swal.fire({
              title: 'Already Enrolled!',
              text: `You are already learning "${c.title}". Keep up the great work!`,
              icon: 'info',
              confirmButtonColor: '#4F46E5',
              background: '#EEF2FF',
              customClass: {
                popup: 'rounded-[24px] border-4 border-[#1E1B4B]'
              }
            });
            return c;
          }
        }
        return c;
      })
    );
  };

  // Add XP and handle levels
  const handleGainXp = (amount) => {
    setXp((prevXp) => {
      const nextXp = prevXp + amount;
      if (nextXp >= 500) {
        setLevel((prevLevel) => prevLevel + 1);
        Swal.fire({
          title: 'LEVEL UP! 🌟',
          text: `Awesome! You reached Level ${level + 1}! You earned a Level badge!`,
          icon: 'success',
          confirmButtonText: 'Epic!',
          confirmButtonColor: '#A78BFA',
          background: '#EEF2FF',
          customClass: {
            popup: 'rounded-[24px] border-4 border-[#1E1B4B] shadow-[8px_8px_0px_#1E1B4B]'
          }
        });
        return nextXp - 500;
      }
      return nextXp;
    });
  };

  // Toggle tasks
  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const nextDone = !t.done;
          if (nextDone) {
            handleGainXp(t.xp);
          } else {
            // Deduct XP
            setXp((prev) => Math.max(0, prev - t.xp));
          }
          return { ...t, done: nextDone };
        }
        return t;
      })
    );
  };

  // Daily Streak Check-in
  const handleStreakCheckIn = () => {
    if (!streakChecked) {
      setStreak(streak + 1);
      setStreakChecked(true);
      handleGainXp(30);
      Swal.fire({
        title: 'Daily Streak! ⚡',
        text: `Streak extended to ${streak + 1} days! You gained +30 XP!`,
        icon: 'success',
        confirmButtonText: 'Awesome',
        confirmButtonColor: '#FBBF24',
        background: '#EEF2FF',
        customClass: {
          popup: 'rounded-[24px] border-4 border-[#1E1B4B] shadow-[8px_8px_0px_#1E1B4B]'
        }
      });
    }
  };

  // Badges info list
  const badgesData = [
    {
      id: 1,
      title: 'Coding Cadet',
      desc: 'Written your first virtual script in Blockly! Web robot fully responsive.',
      color: 'bg-violet-400 text-violet-950',
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 2,
      title: 'Space Cadet',
      desc: 'Completed the Planet Discovery Mission in Space Explorer 101.',
      color: 'bg-sky-400 text-sky-950',
      icon: <Rocket className="w-8 h-8" />
    },
    {
      id: 3,
      title: 'Star Solver',
      desc: 'Achieved a perfect score in 5 consecutive Math dungeon tests.',
      color: 'bg-yellow-400 text-yellow-950',
      icon: <Award className="w-8 h-8" />
    }
  ];

  // Enrollment Form Submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.parentName || !formData.childName || !formData.email || !formData.childAge) {
      Swal.fire({
        title: 'Oops!',
        text: 'Please fill in all fields to register!',
        icon: 'warning',
        confirmButtonColor: '#F97316',
        background: '#EEF2FF',
        customClass: {
          popup: 'rounded-[24px] border-4 border-[#1E1B4B]'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Welcome to PlayLearn! 🚀',
      html: `
        <div class="text-left font-sans space-y-2">
          <p><strong>Parent:</strong> ${formData.parentName}</p>
          <p><strong>Student:</strong> ${formData.childName} (Age ${formData.childAge})</p>
          <p><strong>Selected Track:</strong> ${formData.interest}</p>
          <p>We've sent an invitation and setup guide to <strong>${formData.email}</strong>.</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Jump Into Class!',
      confirmButtonColor: '#34D399',
      background: '#EEF2FF',
      customClass: {
        popup: 'rounded-[24px] border-4 border-[#1E1B4B] shadow-[8px_8px_0px_#1E1B4B]'
      }
    });

    // Reset form
    setFormData({
      parentName: '',
      childName: '',
      childAge: '',
      interest: 'Coding',
      email: ''
    });
  };

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#EEF2FF] text-[#1E1B4B] font-sans antialiased overflow-x-hidden pb-12 selection:bg-pink-300 selection:text-pink-950">
      
      {/* Floating Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-md rounded-2xl border-4 border-[#1E1B4B] shadow-[4px_4px_0px_#1E1B4B] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="bg-[#F97316] p-2 rounded-xl border-2 border-[#1E1B4B] shadow-[2px_2px_0px_#1E1B4B] transition-transform group-hover:rotate-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <span className="font-fredoka text-2xl font-bold tracking-tight text-[#1E1B4B] select-none">
            Play<span className="text-[#F97316]">Learn</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-fredoka font-semibold text-lg">
          <a href="#features" className="hover:text-[#F97316] transition-colors cursor-pointer">Features</a>
          <a href="#catalog" className="hover:text-[#F97316] transition-colors cursor-pointer">Courses</a>
          <a href="#demo" className="hover:text-[#F97316] transition-colors cursor-pointer">Progress Demo</a>
          <a href="#testimonials" className="hover:text-[#F97316] transition-colors cursor-pointer">Testimonials</a>
          <a href="#enroll" className="hover:text-[#F97316] transition-colors cursor-pointer font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg">Join Free</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border-3 border-[#1E1B4B] rounded-xl hover:bg-gray-100 font-fredoka font-bold shadow-[2px_2px_0px_#1E1B4B] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#1E1B4B]"
          >
            <User className="w-4 h-4" />
            Portal Login
          </Link>
          <a
            href="#enroll"
            className="px-5 py-2 bg-[#F97316] text-white border-3 border-[#1E1B4B] rounded-xl font-fredoka font-bold shadow-[2px_2px_0px_#1E1B4B] hover:shadow-[4px_4px_0px_#1E1B4B] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#1E1B4B] transition-all cursor-pointer text-center"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Spacer for fixed Navbar */}
      <div className="h-28"></div>

      {/* Hero Section */}
      <section className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EC4899] text-white border-3 border-[#1E1B4B] rounded-full font-fredoka font-bold shadow-[3px_3px_0px_#1E1B4B] text-sm animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            Gamified Learning Playground
          </div>
          
          <h1 className="font-fredoka text-4xl sm:text-6xl font-bold leading-tight text-[#1E1B4B]">
            Where Learning Feels Like <span className="text-[#4F46E5] underline decoration-wavy decoration-yellow-400">Play</span>!
          </h1>
          
          <p className="text-xl text-[#3730A3] font-medium leading-relaxed max-w-2xl">
            Spark your child's curiosity with playful claymorphic lessons, interactive robotics, cosmic science quests, and rewarding progress loops. Designed for kids aged 5 to 14.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#catalog"
              className="clay-btn-orange font-fredoka font-bold text-lg px-8 py-4 flex items-center gap-3 cursor-pointer text-white"
            >
              Explore Course Catalog
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <a
              href="#demo"
              className="clay-btn-white font-fredoka font-bold text-lg px-8 py-4 flex items-center gap-3 cursor-pointer text-[#1E1B4B]"
            >
              <Play className="w-5 h-5 text-indigo-600 fill-indigo-600" />
              Try Progress Demo
            </a>
          </div>

          {/* Micro Social Proof Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 w-full border-t-4 border-dashed border-indigo-200">
            <div>
              <p className="font-fredoka text-3xl font-bold text-[#4F46E5]">12,000+</p>
              <p className="text-sm font-semibold text-indigo-700">Active Explorers</p>
            </div>
            <div>
              <p className="font-fredoka text-3xl font-bold text-[#EC4899]">98%</p>
              <p className="text-sm font-semibold text-indigo-700">Parent Satisfaction</p>
            </div>
            <div>
              <p className="font-fredoka text-3xl font-bold text-[#FBBF24]">150+</p>
              <p className="text-sm font-semibold text-indigo-700">Interactive Badges</p>
            </div>
          </div>
        </div>

        {/* Right Graphic Column (Mockup App Window) */}
        <div className="lg:col-span-5 relative">
          
          {/* Decorative clay elements floating */}
          <div className="absolute -top-6 -left-6 bg-pink-400 text-white font-fredoka font-bold px-4 py-2 border-3 border-[#1E1B4B] rounded-2xl shadow-[4px_4px_0px_#1E1B4B] -rotate-6 z-10">
            🚀 Orbit Level 3!
          </div>
          <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-indigo-950 font-fredoka font-bold px-4 py-2 border-3 border-[#1E1B4B] rounded-2xl shadow-[4px_4px_0px_#1E1B4B] rotate-12 z-10">
            🏆 Badge Earned!
          </div>

          {/* Simulated App Screen Card - Claymorphic White */}
          <div className="clay-card-white p-6 relative overflow-hidden flex flex-col gap-4">
            
            {/* Header simulation */}
            <div className="flex items-center justify-between border-b-4 border-indigo-50 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400 border-2 border-indigo-950"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-indigo-950"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-indigo-950"></span>
              </div>
              <span className="bg-indigo-100 text-indigo-900 font-fredoka font-bold text-xs px-3 py-1 rounded-full">
                student-dashboard.playlearn
              </span>
            </div>

            {/* Simulated Student Profile */}
            <div className="flex items-center gap-4 bg-indigo-50/70 p-3 rounded-2xl border-2 border-indigo-150">
              <AvatarSVG1 />
              <div>
                <h4 className="font-fredoka text-lg font-bold">Emma Space Cadet</h4>
                <p className="text-xs font-semibold text-indigo-700">Class: Rocket Science & Math Spells</p>
              </div>
            </div>

            {/* Simulated Live Game Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#E0F2FE] p-3 rounded-xl border-3 border-[#1E1B4B] shadow-[3px_3px_0px_#1E1B4B]">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">Rank</span>
                <p className="font-fredoka text-xl font-bold">Star Commander</p>
              </div>
              <div className="bg-[#FEF3C7] p-3 rounded-xl border-3 border-[#1E1B4B] shadow-[3px_3px_0px_#1E1B4B]">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Points</span>
                <p className="font-fredoka text-xl font-bold">480 XP</p>
              </div>
            </div>

            {/* Learning Path Module Preview */}
            <div className="border-3 border-[#1E1B4B] rounded-2xl p-4 bg-white shadow-[3px_3px_0px_#1E1B4B] relative">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-[#34D399] text-[#1E1B4B] text-xs font-bold px-2 py-0.5 rounded border-2 border-[#1E1B4B]">
                  UNIT 4
                </span>
                <span className="text-xs font-bold text-indigo-600">80% Done</span>
              </div>
              <h5 className="font-fredoka font-bold text-base mb-2">Asteroids & Cosmic Orbits</h5>
              <div className="w-full bg-gray-100 rounded-full h-4 border-2 border-[#1E1B4B] overflow-hidden">
                <div className="bg-[#EC4899] h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            {/* Play Button Action */}
            <button className="w-full py-3 bg-[#4F46E5] text-white font-fredoka font-bold rounded-xl border-3 border-[#1E1B4B] shadow-[3px_3px_0px_#1E1B4B] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#1E1B4B] transition-all cursor-pointer">
              Launch Space Simulation! ☄️
            </button>
          </div>

        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="px-6 py-20 bg-indigo-50 border-t-8 border-b-8 border-[#1E1B4B] relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-pink-600 font-bold uppercase tracking-wider text-sm bg-pink-100 px-3 py-1 rounded-lg">
              WHY CHILDREN LOVE US
            </span>
            <h2 className="font-fredoka text-3xl sm:text-5xl font-bold">
              Learning Crafted Like Toys
            </h2>
            <p className="text-lg text-indigo-900 font-medium">
              We design every component to feel solid, satisfying, and responsive. No flat spreadsheets, just pure tactile adventure.
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1: Adaptive Learning */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="clay-card-sky p-6 flex flex-col gap-4 text-left border-4 border-[#1E1B4B] cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-xl border-3 border-[#1E1B4B] flex items-center justify-center shadow-[2px_2px_0px_#1E1B4B]">
                <Compass className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="font-fredoka text-xl font-bold">Adaptive Quests</h3>
              <p className="text-sm font-semibold text-sky-950 leading-relaxed">
                Lessons scale up or down depending on your child's pace. Never too hard, never boring, always exciting.
              </p>
            </motion.div>

            {/* Card 2: Certified Teachers */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="clay-card-purple p-6 flex flex-col gap-4 text-left border-4 border-[#1E1B4B] cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-xl border-3 border-[#1E1B4B] flex items-center justify-center shadow-[2px_2px_0px_#1E1B4B]">
                <Smile className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="font-fredoka text-xl font-bold">Playful Experts</h3>
              <p className="text-sm font-semibold text-purple-950 leading-relaxed">
                Led by educators who teach math through dungeons and science through story books. True mentors.
              </p>
            </motion.div>

            {/* Card 3: Gamified Badges */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="clay-card-yellow p-6 flex flex-col gap-4 text-left border-4 border-[#1E1B4B] cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-xl border-3 border-[#1E1B4B] flex items-center justify-center shadow-[2px_2px_0px_#1E1B4B]">
                <Trophy className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-fredoka text-xl font-bold">3D Achievements</h3>
              <p className="text-sm font-semibold text-yellow-950 leading-relaxed">
                Every milestone unlocks beautiful, clickable 3D badges with secret facts. Boosts intrinsic learning.
              </p>
            </motion.div>

            {/* Card 4: Global Community */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="clay-card-pink p-6 flex flex-col gap-4 text-left border-4 border-[#1E1B4B] cursor-pointer text-white"
            >
              <div className="w-12 h-12 bg-white rounded-xl border-3 border-[#1E1B4B] flex items-center justify-center shadow-[2px_2px_0px_#1E1B4B]">
                <Users className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="font-fredoka text-xl font-bold">Team Puzzles</h3>
              <p className="text-sm font-semibold text-pink-100 leading-relaxed">
                Safely collaborate in team missions. Solve riddles together, foster friendships and logic.
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Course Catalog Preview */}
      <section id="catalog" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-yellow-600 font-bold uppercase tracking-wider text-sm bg-yellow-100 px-3 py-1 rounded-lg">
            CLASSROOM PREVIEW
          </span>
          <h2 className="font-fredoka text-3xl sm:text-5xl font-bold">
            Curious Courses to Explore
          </h2>
          <p className="text-lg text-indigo-900 font-medium">
            Find the adventure that sparks your child's interest. Switch categories below to browse our selection.
          </p>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 font-fredoka font-bold text-sm border-3 border-[#1E1B4B] rounded-xl shadow-[3px_3px_0px_#1E1B4B] transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#4F46E5] text-white translate-x-[2px] translate-y-[2px] shadow-[1px_1px_0px_#1E1B4B]'
                    : 'bg-white text-[#1E1B4B] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1E1B4B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={course.id}
                className={`${course.bgClass} p-6 border-4 border-[#1E1B4B] flex flex-col justify-between h-[420px] cursor-default`}
              >
                <div>
                  {/* Top line info */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-[#1E1B4B] ${course.badgeColor}`}>
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border-2 border-[#1E1B4B] text-amber-800 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-600" />
                      {course.rating}
                    </div>
                  </div>

                  <h3 className="font-fredoka text-2xl font-bold mb-3 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-sm font-semibold opacity-90 leading-relaxed mb-6">
                    {course.description}
                  </p>
                </div>

                {/* Bottom line actions */}
                <div className="space-y-4">
                  {/* Stats bar */}
                  <div className="flex justify-between items-center text-xs font-bold bg-white/40 p-2.5 rounded-xl border-2 border-[#1E1B4B]/35">
                    <span>⏳ {course.duration}</span>
                    <span>👥 {course.students.toLocaleString()} Students</span>
                  </div>

                  <button
                    onClick={() => handleEnrollCourse(course.id)}
                    className={`w-full py-3.5 font-fredoka font-bold rounded-xl border-3 border-[#1E1B4B] transition-all cursor-pointer ${
                      course.enrolled
                        ? 'bg-emerald-400 text-emerald-950 shadow-[1px_1px_0px_#1E1B4B] translate-x-[2px] translate-y-[2px]'
                        : 'bg-white text-[#1E1B4B] shadow-[4px_4px_0px_#1E1B4B] hover:shadow-[5px_5px_0px_#1E1B4B] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#1E1B4B]'
                    }`}
                  >
                    {course.enrolled ? '✓ Enrolled' : 'Enroll Now!'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Progress Tracking Live Demo */}
      <section id="demo" className="px-6 py-20 bg-[#4F46E5]/10 border-t-8 border-b-8 border-[#1E1B4B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text/Info Column */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm bg-indigo-150 px-3 py-1 rounded-lg">
              TRY IT YOURSELF
            </span>
            <h2 className="font-fredoka text-3xl sm:text-5xl font-bold leading-tight">
              A Live Taste of the Student Dashboard
            </h2>
            <p className="text-lg text-indigo-900 font-medium leading-relaxed">
              We reward students instantly for their study habits. Tick off pending tasks, click study buttons, or claim your daily streak check-in to watch Emma level up!
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-[#34D399] p-2.5 rounded-lg border-2 border-[#1E1B4B] self-start shadow-[2px_2px_0px_#1E1B4B]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                </div>
                <div>
                  <h4 className="font-fredoka text-lg font-bold">XP Progress Bar</h4>
                  <p className="text-sm font-semibold text-indigo-700">Accumulate XP to unlock level upgrades.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-[#FBBF24] p-2.5 rounded-lg border-2 border-[#1E1B4B] self-start shadow-[2px_2px_0px_#1E1B4B]">
                  <Flame className="w-5 h-5 text-amber-950" />
                </div>
                <div>
                  <h4 className="font-fredoka text-lg font-bold">Streak Milestones</h4>
                  <p className="text-sm font-semibold text-indigo-700">Streaks boost learner engagement and retention.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Widget Column */}
          <div className="lg:col-span-7">
            <div className="clay-card-white p-6 md:p-8 border-4 border-[#1E1B4B] flex flex-col gap-6 text-left relative overflow-hidden">
              
              {/* Level badge overlay */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#A78BFA] text-[#1E1B4B] border-3 border-[#1E1B4B] rounded-2xl shadow-[3px_3px_0px_#1E1B4B] px-4 py-2">
                <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="font-fredoka font-bold">LEVEL {level}</span>
              </div>

              <div>
                <h3 className="font-fredoka text-2xl font-bold flex items-center gap-2">
                  <BookOpenCheck className="w-7 h-7 text-indigo-600" />
                  Interactive Study Portal
                </h3>
                <p className="text-sm font-semibold text-indigo-600">Emma's Sandbox Workspace</p>
              </div>

              {/* Progress and XP level tracker */}
              <div className="space-y-2 bg-indigo-50/50 p-4 rounded-2xl border-2 border-indigo-150">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>XP Gained: <strong className="text-indigo-700">{xp}/500 XP</strong></span>
                  <span className="text-indigo-600 font-extrabold uppercase">Next Level: {500 - xp} XP needed</span>
                </div>
                <div className="w-full bg-white rounded-full h-6 border-3 border-[#1E1B4B] overflow-hidden relative p-[2px]">
                  <motion.div
                    className="bg-[#EC4899] h-full rounded-full"
                    animate={{ width: `${(xp / 500) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                  ></motion.div>
                </div>
              </div>

              {/* Action grid (Tasks & Streaks) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Pending Tasks (7 columns) */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="font-fredoka text-lg font-bold">Emma's Tasks for Today</h4>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <label
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 border-[#1E1B4B] cursor-pointer transition-colors ${
                          task.done
                            ? 'bg-[#D1FAE5] line-through text-[#065F46] font-semibold'
                            : 'bg-white text-[#1E1B4B] font-bold hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleToggleTask(task.id)}
                          className="w-5 h-5 rounded-md border-2 border-[#1E1B4B] text-[#4F46E5] focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-sm">{task.text}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Daily Streak & Badges (5 columns) */}
                <div className="md:col-span-5 space-y-6">
                  {/* Daily Streak Card */}
                  <div className="clay-card-yellow p-5 border-3 border-[#1E1B4B] text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full border-3 border-[#1E1B4B] flex items-center justify-center shadow-[2px_2px_0px_#1E1B4B]">
                      <Flame className={`w-8 h-8 ${streakChecked ? 'text-[#F97316] fill-[#F97316]' : 'text-gray-400 animate-pulse'}`} />
                    </div>
                    <div>
                      <h4 className="font-fredoka text-lg font-bold">Daily Streak Checklist</h4>
                      <p className="text-3xl font-extrabold text-orange-600 mt-1">{streak} Days! ⚡</p>
                    </div>
                    <button
                      onClick={handleStreakCheckIn}
                      disabled={streakChecked}
                      className={`w-full py-2.5 font-fredoka font-bold rounded-xl border-3 border-[#1E1B4B] transition-all cursor-pointer ${
                        streakChecked
                          ? 'bg-yellow-200 text-yellow-800 shadow-[1px_1px_0px_#1E1B4B] translate-x-[2px] translate-y-[2px] cursor-not-allowed'
                          : 'bg-white text-[#1E1B4B] shadow-[3px_3px_0px_#1E1B4B] hover:shadow-[4px_4px_0px_#1E1B4B] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#1E1B4B]'
                      }`}
                    >
                      {streakChecked ? '✓ Checked-In Today!' : 'Claim Daily +30 XP!'}
                    </button>
                  </div>

                  {/* Badge Collection Card */}
                  <div className="bg-white p-5 rounded-2xl border-3 border-[#1E1B4B] shadow-[4px_4px_0px_#1E1B4B] space-y-3">
                    <h4 className="font-fredoka text-lg font-bold">Unlocked Badges</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {badgesData.map((badge) => (
                        <button
                          key={badge.id}
                          onClick={() => setSelectedBadge(badge)}
                          className={`p-3 rounded-xl border-3 border-[#1E1B4B] flex items-center justify-center transition-all ${badge.color} ${
                            selectedBadge?.id === badge.id
                              ? 'shadow-[1px_1px_0px_#1E1B4B] translate-x-[2px] translate-y-[2px]'
                              : 'shadow-[3px_3px_0px_#1E1B4B] hover:scale-105'
                          }`}
                          title={badge.title}
                        >
                          {badge.icon}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedBadge ? (
                        <motion.div
                          key={selectedBadge.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="p-3 bg-indigo-50 rounded-xl border-2 border-[#1E1B4B] mt-2 text-xs text-left"
                        >
                          <p className="font-fredoka font-bold text-sm text-indigo-950">{selectedBadge.title}</p>
                          <p className="text-indigo-800 font-medium mt-1 leading-relaxed">{selectedBadge.desc}</p>
                        </motion.div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl border-2 border-[#1E1B4B] border-dashed mt-2 text-center text-xs text-gray-500 font-semibold">
                          Tap a badge above to read details!
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-pink-600 font-bold uppercase tracking-wider text-sm bg-pink-100 px-3 py-1 rounded-lg">
            STUDENT SUCCESS STORIES
          </span>
          <h2 className="font-fredoka text-3xl sm:text-5xl font-bold">
            What Our Explorers Say
          </h2>
          <p className="text-lg text-indigo-900 font-medium">
            Over 12,000 students have leveled up their coding, science, and math skills. Here's what their parents say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="clay-card-white p-6 border-4 border-[#1E1B4B] flex flex-col justify-between gap-6 text-left">
            <p className="text-sm font-semibold text-indigo-955 leading-relaxed italic">
              "My daughter Emma absolutely loves the Magic Math Quest. She used to struggle with addition, but now she treats arithmetic like spelling magical castle charms. 10/10 gamification!"
            </p>
            <div className="flex items-center gap-3">
              <AvatarSVG2 />
              <div>
                <h4 className="font-fredoka font-bold">Sarah Jenkins</h4>
                <p className="text-xs font-semibold text-indigo-600">Parent of Emma (Age 8)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="clay-card-white p-6 border-4 border-[#1E1B4B] flex flex-col justify-between gap-6 text-left">
            <p className="text-sm font-semibold text-[#1E1B4B] leading-relaxed italic">
              "The Space Explorer course has completely transformed Leo's weekend routine. He spent hours building virtual orbits and learning about cosmic stardust. The claymorphism visual aesthetic is beautiful!"
            </p>
            <div className="flex items-center gap-3">
              <AvatarSVG3 />
              <div>
                <h4 className="font-fredoka font-bold">David Miller</h4>
                <p className="text-xs font-semibold text-indigo-600">Parent of Leo (Age 10)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="clay-card-white p-6 border-4 border-[#1E1B4B] flex flex-col justify-between gap-6 text-left">
            <p className="text-sm font-semibold text-[#1E1B4B] leading-relaxed italic">
              "Byte Bot instructor is fantastic! My son built a fully functional virtual robot using the block code drag-and-drop system. He is already asking to learn advanced Python!"
            </p>
            <div className="flex items-center gap-3">
              <AvatarSVG4 />
              <div>
                <h4 className="font-fredoka font-bold">Jessica Carter</h4>
                <p className="text-xs font-semibold text-indigo-600">Parent of Noah (Age 12)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form / CTA Section */}
      <section id="enroll" className="px-6 py-20 bg-[#EEF2FF] border-t-8 border-b-8 border-[#1E1B4B]">
        <div className="max-w-4xl mx-auto">
          <div className="clay-card-white p-8 md:p-12 border-4 border-[#1E1B4B] text-center space-y-8 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/60 rounded-full mix-blend-multiply filter blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-100/60 rounded-full mix-blend-multiply filter blur-2xl pointer-events-none"></div>

            <div className="space-y-4">
              <span className="text-[#F97316] font-bold uppercase tracking-wider text-sm bg-orange-100 px-3 py-1 rounded-lg">
                GET STARTED FREE
              </span>
              <h2 className="font-fredoka text-3xl sm:text-5xl font-bold text-[#1E1B4B]">
                Begin Your Child's Quest!
              </h2>
              <p className="text-base sm:text-lg text-indigo-900 font-medium max-w-2xl mx-auto">
                Sign up today to receive a free introductory lesson package and set up your student's learning avatar dashboard.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Parent Name */}
              <div>
                <label className="block font-fredoka font-bold text-sm text-[#1E1B4B] mb-2">Parent Name</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-3 border-3 border-[#1E1B4B] rounded-xl font-medium focus:outline-none focus:ring-3 focus:ring-indigo-200"
                />
              </div>

              {/* Child Name */}
              <div>
                <label className="block font-fredoka font-bold text-sm text-[#1E1B4B] mb-2">Child Name</label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  placeholder="e.g. Emma"
                  className="w-full px-4 py-3 border-3 border-[#1E1B4B] rounded-xl font-medium focus:outline-none focus:ring-3 focus:ring-indigo-200"
                />
              </div>

              {/* Child Age */}
              <div>
                <label className="block font-fredoka font-bold text-sm text-[#1E1B4B] mb-2">Child Age</label>
                <input
                  type="number"
                  value={formData.childAge}
                  onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                  placeholder="e.g. 8"
                  min="5"
                  max="14"
                  className="w-full px-4 py-3 border-3 border-[#1E1B4B] rounded-xl font-medium focus:outline-none focus:ring-3 focus:ring-indigo-200"
                />
              </div>

              {/* Learning Track dropdown */}
              <div>
                <label className="block font-fredoka font-bold text-sm text-[#1E1B4B] mb-2">Preferred Track</label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-[#1E1B4B] rounded-xl font-medium focus:outline-none focus:ring-3 focus:ring-indigo-200 bg-white"
                >
                  <option value="Coding">Coding & Robotics</option>
                  <option value="Math">Math Spell Quest</option>
                  <option value="Science">Cosmic Science</option>
                  <option value="Creative">Creative Writing</option>
                </select>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block font-fredoka font-bold text-sm text-[#1E1B4B] mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. sarah@domain.com"
                  className="w-full px-4 py-3 border-3 border-[#1E1B4B] rounded-xl font-medium focus:outline-none focus:ring-3 focus:ring-indigo-200"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#F97316] text-white font-fredoka font-bold text-lg rounded-xl border-3 border-[#1E1B4B] shadow-[4px_4px_0px_#1E1B4B] hover:shadow-[5px_5px_0px_#1E1B4B] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#1E1B4B] transition-all cursor-pointer flex items-center justify-center gap-3"
                >
                  Start Your Journey! 🚀
                </button>
              </div>
            </form>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-[#1E1B4B]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F97316] p-1.5 rounded-lg border-2 border-[#1E1B4B]">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-fredoka text-xl font-bold">Play<span className="text-[#F97316]">Learn</span></span>
            </div>
            <p className="text-sm font-semibold text-indigo-900 leading-relaxed">
              Making education tactile, gamified, and responsive. Built for the future star commanders of the world.
            </p>
          </div>
          
          <div>
            <h5 className="font-fredoka font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm font-semibold text-indigo-900">
              <li><a href="#features" className="hover:text-[#F97316]">Features</a></li>
              <li><a href="#catalog" className="hover:text-[#F97316]">Course Catalog</a></li>
              <li><a href="#demo" className="hover:text-[#F97316]">Progress Sandbox</a></li>
              <li><a href="#testimonials" className="hover:text-[#F97316]">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-fredoka font-bold text-sm uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2 text-sm font-semibold text-indigo-900">
              <li><a href="#" className="hover:text-[#F97316]">Parent Helpdesk</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Privacy Guidelines</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Contact Advisors</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-fredoka font-bold text-sm uppercase tracking-wider mb-4">Newsletter</h5>
            <p className="text-xs font-semibold text-indigo-900 mb-3">Join our community newsletter for weekly logic puzzles!</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border-2 border-[#1E1B4B] rounded-lg text-xs font-medium focus:outline-none focus:border-orange-500"
              />
              <button className="px-3 py-2 bg-[#F97316] text-white border-2 border-[#1E1B4B] rounded-lg font-fredoka font-bold text-xs shadow-[2px_2px_0px_#1E1B4B]">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t-3 border-indigo-150 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-bold text-indigo-700">
          <p>© 2026 PlayLearn Gamified Edtech. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#F97316]">Instagram</a>
            <a href="#" className="hover:text-[#F97316]">Twitter/X</a>
            <a href="#" className="hover:text-[#F97316]">YouTube Channel</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
