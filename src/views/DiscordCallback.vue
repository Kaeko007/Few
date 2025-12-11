<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const code = route.query.code;
  if (code) {
    // Exchange the code for an access token
    const params = new URLSearchParams({
      client_id: '1259472762850775042',
      client_secret: 'QclEUDASNqcBLz18fF44jvo4geP5ldt2',   // This should be real in production
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://viteprojectest.netlify.app/discord-callback'
    });
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (tokenRes.ok) {
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Store the login status and access token in localStorage
    if (accessToken) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('accessToken', accessToken);

      // Redirect to dashboard after 1 second
      setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
    } else {
        router.push('/');
    }
  } else {
      console.error('Failed to fetch access token', await tokenRes.text());
      router.push('/');
  }
  } else {
    router.push('/');
  }
});
</script>

<template>
  <div style="text-align:center; margin-top:100px; color:white;">
    <h2>Logging in with Discord...</h2>
  </div>
</template>
