import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    navDashboard: "Dashboard",
    navMyTrips: "My Trips",
    navProfile: "Profile",
    navHistory: "History",
    navSettings: "Settings",
    navLogOut: "Log Out",
    
    // Profile Page
    editCover: "Edit Cover",
    editProfile: "Edit Profile",
    btnDashboard: "Dashboard",
    signOut: "Sign Out",
    genPref: "Language Preference",
    langDesc: "Toggle between English and Tamil",
    notifications: "Notifications",
    notifDesc: "Email alerts and push notifications",
    privacy: "Privacy & Security",
    privacyDesc: "Password, 2FA, and linked accounts",
    travelPref: "Travel Preferences",
    travelPrefDesc: "Dietary requirements and seating",
    accountSettings: "Account Settings",
    travelStats: "Travel Stats",
    statTrips: "Trips",
    statMiles: "Miles",
    statPlaces: "Places",
    aboutMe: "About Me",
    aboutText: "Passionate explorer and photography enthusiast. Always looking for the next big adventure. My favorite destinations involve mountains, hiking trails, and authentic local food.",
    livesIn: "Lives in San Francisco, CA",
    joined: "Joined March 2024",
    
    // Dashboard Page
    shareTrip: "Share Trip",
    openItinerary: "Open Itinerary",
    viewAllActivity: "View All Activity",
    
    // Trips Page
    saveTrip: "Save Trip",
    useCurrentLocation: "Use Current Location",
    setDestination: "Set Your Destination",
    locating: "Locating...",
    country: "Country",
    stateRegion: "State / Region",
    areaCity: "Area / City",
    
    // History Page
    clearAll: "Clear All",
    goToDashboard: "Go to Dashboard",
    noSearches: "No searches yet",
    
    // AI Chat Page
    navAIChat: "AI Assistant",
    chatWelcomeTitle: "Traveloop AI",
    chatWelcomeSub: "Your personal travel companion. Ask me to plan itineraries, find hidden gems, or estimate expenses!",
    chatPlaceholder: "Ask Traveloop AI anything...",
    chatSend: "Send",
    chatTyping: "Traveloop AI is thinking..."
  },
  ta: {
    // Navigation
    navDashboard: "முகப்பு",
    navMyTrips: "என் பயணங்கள்",
    navProfile: "சுயவிவரம்",
    navHistory: "வரலாறு",
    navSettings: "அமைப்புகள்",
    navLogOut: "வெளியேறு",
    
    // Profile Page
    editCover: "அட்டைப்படத்தை மாற்று",
    editProfile: "சுயவிவரத்தை திருத்து",
    btnDashboard: "முகப்பு",
    signOut: "வெளியேறு",
    genPref: "மொழி முன்னுரிமை",
    langDesc: "ஆங்கிலம் மற்றும் தமிழுக்கு இடையே மாற்றவும்",
    notifications: "அறிவிப்புகள்",
    notifDesc: "மின்னஞ்சல் எச்சரிக்கைகள் மற்றும் அறிவிப்புகள்",
    privacy: "தனியுரிமை மற்றும் பாதுகாப்பு",
    privacyDesc: "கடவுச்சொல், 2FA மற்றும் கணக்குகள்",
    travelPref: "பயண முன்னுரிமைகள்",
    travelPrefDesc: "உணவு தேவைகள் மற்றும் இருக்கைகள்",
    accountSettings: "கணக்கு அமைப்புகள்",
    travelStats: "பயண புள்ளிவிவரங்கள்",
    statTrips: "பயணங்கள்",
    statMiles: "மைல்கள்",
    statPlaces: "இடங்கள்",
    aboutMe: "என்னை பற்றி",
    aboutText: "ஆர்வமுள்ள ஆய்வாளர் மற்றும் புகைப்படக் கலைஞர். எப்போதும் அடுத்த பெரிய சாகசத்தை தேடுகிறேன். மலைகள், நடைபாதைகள் மற்றும் உண்மையான உள்ளூர் உணவு ஆகியவை எனக்குப் பிடித்த இடங்களாகும்.",
    livesIn: "சான் பிரான்சிஸ்கோ, CA-வில் வசிக்கிறார்",
    joined: "மார்ச் 2024 இல் இணைந்தார்",
    
    // Dashboard Page
    shareTrip: "பகிர்",
    openItinerary: "பயணத்திட்டத்தை திற",
    viewAllActivity: "அனைத்து செயல்களையும் காண்",
    
    // Trips Page
    saveTrip: "பயணத்தை சேமி",
    useCurrentLocation: "தற்போதைய இருப்பிடத்தைப் பயன்படுத்து",
    setDestination: "உங்கள் இலக்கை அமைக்கவும்",
    locating: "கண்டறியப்படுகிறது...",
    country: "நாடு",
    stateRegion: "மாநிலம் / பகுதி",
    areaCity: "பகுதி / நகரம்",
    
    // History Page
    clearAll: "அனைத்தையும் அழி",
    goToDashboard: "முகப்பிற்கு செல்",
    noSearches: "தேடல்கள் எதுவும் இல்லை",
    
    // AI Chat Page
    navAIChat: "AI உதவியாளர்",
    chatWelcomeTitle: "டிராவலூப் AI",
    chatWelcomeSub: "உங்கள் தனிப்பட்ட பயண தோழன். பயணத்திட்டங்களை திட்டமிடவும், மறைந்திருக்கும் இடங்களைக் கண்டறியவும் அல்லது செலவுகளை மதிப்பிடவும் என்னிடம் கேளுங்கள்!",
    chatPlaceholder: "டிராவலூப் AI-யிடம் எதையும் கேளுங்கள்...",
    chatSend: "அனுப்பு",
    chatTyping: "டிராவலூப் AI யோசிக்கிறது..."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
