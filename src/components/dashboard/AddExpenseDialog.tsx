
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addExpense } from "@/services/expenseService";
import { getExpenseCategories } from "@/services/financeService";

const expenseFormSchema = z.object({
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)), "O valor deve ser um número")
    .refine((val) => Number(val) > 0, "O valor deve ser maior que zero"),
  category: z.string().min(1, "Selecione uma categoria"),
  date: z.date(),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Categorias padrão (fallback)
const defaultCategories = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Vestuário",
  "Serviços",
  "Outros",
];

interface AddExpenseDialogProps {
  trigger?: React.ReactNode;
  onAddExpense?: (expense: ExpenseFormValues) => void;
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  trigger,
  onAddExpense,
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar categorias do banco de dados
  const { data: expenseCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ["expenseCategories"],
    queryFn: getExpenseCategories
  });
  
  // Combinar categorias padrão com as categorias personalizadas
  const allCategories = React.useMemo(() => {
    if (!expenseCategories || expenseCategories.length === 0) {
      return defaultCategories;
    }
    
    // Extrair nomes de categorias únicas
    const categoryNames = new Set([
      ...defaultCategories,
      ...expenseCategories.map(cat => cat.name)
    ]);
    
    return Array.from(categoryNames).sort();
  }, [expenseCategories]);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      date: new Date(),
      notes: "",
      isRecurring: false,
    },
  });

  const mutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["recentExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["financialSummary"] });
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      queryClient.invalidateQueries({ queryKey: ["recentTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["reportData"] });
      
      toast({
        title: "Despesa adicionada",
        description: "Sua despesa foi adicionada com sucesso",
      });
      
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao adicionar despesa:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a despesa",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: ExpenseFormValues) {
    try {
      // Converter o valor para número
      const expense = {
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        notes: data.notes,
        is_recurring: data.isRecurring,
      };

      mutation.mutate(expense);
      
      if (onAddExpense) {
        onAddExpense(data);
      }
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a despesa",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="flex items-center gap-2">
            <span>Nova Despesa</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
          <DialogDescription>
            Adicione os detalhes da sua despesa
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Mercado, aluguel, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0,00"
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorias</SelectLabel>
                        {loadingCategories ? (
                          <SelectItem value="carregando" disabled>Carregando categorias...</SelectItem>
                        ) : (
                          allCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes adicionais sobre essa despesa..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adicionando..." : "Adicionar Despesa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
