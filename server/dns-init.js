import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
console.log("🎯 Node.js DNS overridden to Google public resolvers.");
