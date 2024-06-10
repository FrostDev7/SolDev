use anchor_lang::prelude::*;

declare_id!("EPwRE34F716h9Bpr18xr4Xwk5fPujoENnZB1adhhVeWQ");

#[program]
pub mod temp_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
