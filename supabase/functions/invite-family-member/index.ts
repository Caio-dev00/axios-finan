
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  familyPlanId: string;
  inviterName?: string;
  inviterEmail?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, familyPlanId, inviterName = "Um usuário", inviterEmail } = await req.json() as RequestBody;
    
    console.log(`Enviando convite para ${email} para o plano familiar ${familyPlanId}`);
    
    // Generate a secure token that includes the family plan ID
    const token = btoa(`invite:${familyPlanId}:${Date.now()}`);
    const inviteLink = `${req.headers.get("origin") || "https://axios-financas.com"}/invite/${token}`;
    
    // Send the email with Resend
    const { data, error } = await resend.emails.send({
      from: "Axios Finanças <convites@axios-financas.com>",
      to: [email],
      subject: "Convite para plano familiar - Axios Finanças",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Convite para Plano Familiar</h2>
          <p>Olá,</p>
          <p>${inviterName} convidou você para participar de um plano familiar no Axios Finanças.</p>
          <p>Com o plano familiar, você pode:</p>
          <ul>
            <li>Compartilhar despesas e receitas com sua família</li>
            <li>Acompanhar orçamentos familiares</li>
            <li>Planejar objetivos financeiros em conjunto</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Aceitar Convite
            </a>
          </div>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #6B7280;">${inviteLink}</p>
          <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
            Se você não conhece esta pessoa ou não esperava este convite, pode ignorar este email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Erro ao enviar email:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email enviado com sucesso:", data);
    return new Response(
      JSON.stringify({ success: true, message: "Convite enviado com sucesso!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Erro na função invite-family-member:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
