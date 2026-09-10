//! The startup ASCII-art banner.

/// Print the VeloxBot startup banner.
pub fn print_banner() {
    println!("\x1b[36;1;3m");
    println!(
        r#"

   ██╗   ██╗███████╗██╗      ██████╗ ██╗  ██╗██████╗  ██████╗ ████████╗
   ██║   ██║██╔════╝██║     ██╔═══██╗╚██╗██╔╝██╔══██╗██╔═══██╗╚══██╔══╝
   ██║   ██║█████╗  ██║     ██║   ██║ ╚███╔╝ ██████╔╝██║   ██║   ██║
   ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║ ██╔██╗ ██╔══██╗██║   ██║   ██║
    ╚████╔╝ ███████╗███████╗╚██████╔╝██╔╝ ██╗██████╔╝╚██████╔╝   ██║
     ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝    ╚═╝

                                             VELOXBOT
                                ◆ Automated Solana DeFi Trading Bot ◆

                  Website: veloxbot.io           Channel: t.me/veloxbotio
                  Docs:    veloxbot.io/docs      Group:   t.me/veloxbotio_talk
                  X:       x.com/veloxbotio      Support: t.me/veloxbotio_support
   s
"#
    );
    println!("\x1b[0m");
}
