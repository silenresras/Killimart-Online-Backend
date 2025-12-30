export async function initNgrok(req, res, next){
    try {
      console.log("initNgrok middleware triggered");
  
      if (!global.ngrokUrl) {
        global.ngrokUrl = await ngrok.connect({
          addr: process.env.PORT || 7000,
          authtoken: process.env.NGROK_AUTHTOKEN
        });
        console.log("🌐 Ngrok tunnel established:", global.ngrokUrl);
      }
  
      req.domain = `${global.ngrokUrl}/api/mpesa/callback`; // explicitly define callback endpoint
      next();
    } catch (error) {
      console.error("Ngrok middleware error:", error.message);
      next(error);
    }
  }
  