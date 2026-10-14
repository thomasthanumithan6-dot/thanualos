import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_APP_ID"
};

const signInDialog = document.getElementById("signInDialog");
const signInButton = document.getElementById("signInButton");
const closeSignIn = document.getElementById("closeSignIn");
const signInForm = document.getElementById("signInForm");
const signInEmail = document.getElementById("signInEmail");
const signInPassword = document.getElementById("signInPassword");
const authSubmit = document.getElementById("authSubmit");
const authModeToggle = document.getElementById("authModeToggle");
const authAccount = document.getElementById("authAccount");
const authAccountEmail = document.getElementById("authAccountEmail");
const authUserId = document.getElementById("authUserId");
const signOutButton = document.getElementById("signOutButton");
const signInStatus = document.getElementById("signInStatus");

let isCreatingAccount = false;
let auth;

const showStatus = message => {
    signInStatus.textContent = message;
};

const setAuthMode = createAccount => {
    isCreatingAccount = createAccount;
    authSubmit.textContent = createAccount ? "Create account" : "Sign in";
    authModeToggle.textContent = createAccount
        ? "Already have an account? Sign in"
        : "Create an account";
    signInPassword.autocomplete = createAccount ? "new-password" : "current-password";
    showStatus("");
};

const firebaseErrorMessage = error => {
    const messages = {
        "auth/email-already-in-use": "An account already exists for this email. Sign in instead.",
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/operation-not-allowed": "Email/password sign-in is not enabled in Firebase yet.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/weak-password": "Choose a stronger password with at least 6 characters.",
        "auth/network-request-failed": "Network error. Check your connection and try again."
    };

    return messages[error.code] || "We couldn't complete that request. Please try again.";
};

signInButton.addEventListener("click", () => {
    if (!signInDialog.open) {
        signInDialog.showModal();
    }
});

closeSignIn.addEventListener("click", () => signInDialog.close());

authModeToggle.addEventListener("click", () => setAuthMode(!isCreatingAccount));

signInForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!auth) return;

    authSubmit.disabled = true;
    showStatus(isCreatingAccount ? "Creating your account..." : "Signing in...");

    try {
        if (isCreatingAccount) {
            await createUserWithEmailAndPassword(auth, signInEmail.value, signInPassword.value);
        } else {
            await signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value);
        }
        signInForm.reset();
        showStatus("");
    } catch (error) {
        showStatus(firebaseErrorMessage(error));
    } finally {
        authSubmit.disabled = false;
    }
});

signOutButton.addEventListener("click", async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        setAuthMode(false);
        showStatus("You have signed out.");
    } catch {
        showStatus("We couldn't sign you out. Please try again.");
    }
});

const configIsReady = Object.values(firebaseConfig).every(
    value => value && !value.startsWith("YOUR_")
);

if (configIsReady) {
    auth = getAuth(initializeApp(firebaseConfig));
    onAuthStateChanged(auth, user => {
        authAccount.hidden = !user;
        signInForm.hidden = Boolean(user);
        authModeToggle.hidden = Boolean(user);
        signInButton.textContent = user ? "My account" : "Sign in";

        if (user) {
            authAccountEmail.textContent = user.email || "Signed in";
            authUserId.textContent = user.uid;
            showStatus("");
        }
    });
} else {
    authSubmit.disabled = true;
    showStatus("Firebase setup required: add your Firebase web app config at the top of auth.js.");
}