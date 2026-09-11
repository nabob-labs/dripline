//! The startup ASCII-art banner.

/// Print the DripLine startup banner.
pub fn print_banner() {
    println!("\x1b[36;1;3m");
    println!(
        r#"
        
   ██████╗ ██████╗ ██╗██████╗ ██╗     ██╗███╗   ██╗███████╗
   ██╔══██╗██╔══██╗██║██╔══██╗██║     ██║████╗  ██║██╔════╝
   ██║  ██║██████╔╝██║██████╔╝██║     ██║██╔██╗ ██║█████╗
   ██║  ██║██╔══██╗██║██╔═══╝ ██║     ██║██║╚██╗██║██╔══╝
   ██████╔╝██║  ██║██║██║     ███████╗██║██║ ╚████║███████╗
   ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝

                                             DRIPLINE
                                ◆ Automated Solana DeFi Trading Bot ◆

                  Website: dripline.io           Channel: t.me/driplineio
                  Docs:    dripline.io/docs      Group:   t.me/driplineio_talk
                  X:       x.com/driplineio      Support: t.me/driplineio_support
   s
"#
    );
    println!("\x1b[0m");
}
