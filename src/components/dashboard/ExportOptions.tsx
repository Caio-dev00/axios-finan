
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/services/currencyService";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProFeature from "@/components/ProFeature";

// Definindo interfaces para os tipos de transações
interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  is_recurring?: boolean;
  created_at: string;
  user_id: string;
  type: 'expense';
}

interface IncomeTransaction {
  id: string;
  description: string;
  amount: number;
  source: string;
  date: Date;
  is_recurring?: boolean;
  created_at: string;
  user_id: string;
  type: 'income';
}

type Transaction = ExpenseTransaction | IncomeTransaction;

interface ExportOptionsProps {
  transactions: Transaction[];
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ transactions }) => {
  const { toast } = useToast();
  const { isPro } = useSubscription();

  // Exportar dados para CSV
  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há transações para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Cria cabeçalhos para o CSV
    const headers = ['Descrição', 'Categoria/Fonte', 'Data', 'Valor', 'Tipo'];
    
    // Formata os dados
    const csvData = transactions.map(transaction => {
      const categoryOrSource = transaction.type === 'expense' 
        ? (transaction as ExpenseTransaction).category 
        : (transaction as IncomeTransaction).source;
      
      return [
        transaction.description,
        categoryOrSource,
        format(new Date(transaction.date), 'dd/MM/yyyy'),
        transaction.amount.toFixed(2),
        transaction.type === 'income' ? 'Receita' : 'Despesa'
      ].join(',');
    });

    // Monta o conteúdo do CSV
    const csvContent = [
      headers.join(','),
      ...csvData
    ].join('\n');

    // Cria o blob e o link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: "Seu arquivo CSV está sendo baixado."
    });
  };

  // Exportar dados para Excel (XLSX)
  const exportToExcel = () => {
    if (transactions.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há transações para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Como não podemos usar bibliotecas externas, vamos usar o formato CSV que o Excel abre
    exportToCSV();
    
    toast({
      title: "Download iniciado",
      description: "Seu arquivo Excel está sendo baixado. Abra-o com o Excel."
    });
  };

  // Exportar dados para PDF
  const exportToPDF = () => {
    if (transactions.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há transações para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Criar uma nova janela para impressão em PDF
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive"
      });
      return;
    }

    // Criar o conteúdo HTML da página PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Transações</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .income { color: green; }
            .expense { color: red; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Relatório de Transações</h1>
          <p>Data de geração: ${format(new Date(), 'dd/MM/yyyy')}</p>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria/Fonte</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => {
                const categoryOrSource = transaction.type === 'expense'
                  ? (transaction as ExpenseTransaction).category
                  : (transaction as IncomeTransaction).source;
                
                return `
                  <tr>
                    <td>${transaction.description}</td>
                    <td>${categoryOrSource}</td>
                    <td>${format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                    <td class="${transaction.type === 'income' ? 'income' : 'expense'}">
                      ${transaction.type === 'income' ? '+' : '-'} R$ ${transaction.amount.toFixed(2)}
                    </td>
                    <td>${transaction.type === 'income' ? 'Receita' : 'Despesa'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: ptBR })}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    // Escrever o HTML na nova janela e imprimir
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    
    toast({
      title: "PDF gerado",
      description: "Seu relatório em PDF está pronto para impressão."
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* PDF exportação disponível para todos */}
      <Button variant="outline" size="sm" onClick={exportToPDF}>
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      
      {/* CSV exportação exclusiva para PRO */}
      <ProFeature fallback={
        <Button variant="outline" size="sm" className="opacity-70 cursor-not-allowed">
          <FileText className="mr-2 h-4 w-4" />
          Exportar CSV <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Pro</span>
        </Button>
      }>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </ProFeature>
      
      {/* Excel exportação exclusiva para PRO */}
      <ProFeature fallback={
        <Button variant="outline" size="sm" className="opacity-70 cursor-not-allowed">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Pro</span>
        </Button>
      }>
        <Button variant="outline" size="sm" onClick={exportToExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
      </ProFeature>
    </div>
  );
};

export default ExportOptions;
