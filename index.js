require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const commands = [
  new SlashCommandBuilder()
    .setName("appoint")
    .setDescription("Appoint a player")
    .addStringOption(o =>
      o.setName("player")
       .setDescription("Player name")
       .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName("role")
       .setDescription("Rank / Role")
       .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Send an announcement")
    .addStringOption(o =>
      o.setName("message")
       .setDescription("Announcement text")
       .setRequired(true)
    )
];

client.once("ready", async () => {
  console.log(`🌙 ${client.user.tag} is online!`);

  await client.application.commands.set(
    commands.map(c => c.toJSON())
  );

  console.log("✅ Commands loaded!");
});

client.on("guildMemberAdd", member => {
  const channel = member.guild.systemChannel;

  if (!channel) return;

  channel.send(
    `🌙 Welcome ${member} to **Moon City Roleplay**!`
  );
});
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "appoint") {

    if (!interaction.member.permissions.has(
      PermissionFlagsBits.ManageRoles
    )) {
      return interaction.reply({
        content: "❌ You don't have permission!",
        ephemeral: true
      });
    }

    const player =
      interaction.options.getString("player");

    const role =
      interaction.options.getRole("role");

    const embed = new EmbedBuilder()
      .setTitle("📢 STAFF APPOINTMENT")
      .setDescription(
        `**${player}** has been appointed as ${role}.`
      )
      .setFooter({
        text: "🌙 Moon City Roleplay"
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
      if (interaction.commandName === "announce") {

    if (!interaction.member.permissions.has(
      PermissionFlagsBits.ManageGuild
    )) {
      return interaction.reply({
        content: "❌ You don't have permission!",
        ephemeral: true
      });
    }

    const message =
      interaction.options.getString("message");

    const embed = new EmbedBuilder()
      .setTitle("📢 MOON CITY RP")
      .setDescription(message)
      .setFooter({
        text: "🌙 Moon City Roleplay"
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  }
});

client.on("error", error => {
  console.log("Bot error:", error);
});

client.login(process.env.TOKEN);
