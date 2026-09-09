# VeloxBot
Solana Ecosystem Decentralized Exchange MEV (Maximal Extractable Value) Bots

## Supported DEXs

Native decoders for direct pool state interpretation:

| DEX          | Programs                    |
| ------------ | --------------------------- |
| **Raydium**  | CLMM, CPMM, Legacy AMM      |
| **Orca**     | Whirlpool                   |
| **Meteora**  | DAMM, DBC, DLMM             |
| **Pumpfun**  | AMM, Legacy (Bonding Curve) |
| **Fluxbeam** | AMM                         |
| **Moonit**   | AMM                         |

### Swap Routers

- **Jupiter V6**: Aggregation with route optimization
- **Direct pool swaps**: The bot builds the DEX instruction itself and swaps straight against the
  pool, across every venue the direct engine supports (Raydium CPMM/AMM v4/CLMM, Orca Whirlpool,
  Meteora DAMM v2/DLMM/DBC, Pump.fun AMM and legacy curves, FluxBeam, Moonit)

Enabled quote routers are queried concurrently with automatic best-output selection and retryable
fallback. Direct pool execution is enabled per `[swaps.direct]` and can pre-simulate every swap.

---