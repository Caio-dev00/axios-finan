
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import { addIncome } from "@/services/incomeService";

const incomeFormSchema = z.object({
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)), "O valor deve ser um número")
    .refine((val) => Number(val) > 0, "O valor deve ser maior que zero"),
  source: z.string().min(1, "Selecione uma fonte"),
  date: z.date(),
  isRecurring: z.boolean().optional(),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

const incomeSources = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Aluguel",
  "Vendas",
  "Dividendos",
  "Outras receitas",
];

interface AddIncomeDialogProps {
  trigger?: React.ReactNode;
  onAddIncome?: (income: IncomeFormValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmitSuccess?: () => void;
}

const AddIncomeDialog: React.FC<AddIncomeDialogProps> = ({
  trigger,
  onAddIncome,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSubmitSuccess,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      source: "",
      date: new Date(),
      isRecurring: false,
    },
  });

  const mutation = useMutation({
    mutationFn: addIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["recentIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["financialSummary"] });
      queryClient.invalidateQueries({ queryKey: ["recentTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["reportData"] });
      
      toast({
        title: "Receita adicionada",
        description: "Sua receita foi adicionada com sucesso",
      });
      
      form.reset();
      setOpen(false);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    },
    onError: (error) => {
      console.error("Erro ao adicionar receita:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a receita",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: IncomeFormValues) {
    try {
      // Converter o valor para número
      const income = {
        description: data.description,
        amount: Number(data.amount),
        source: data.source,
        date: data.date,
        is_recurring: data.isRecurring
      };

      mutation.mutate(income);
      
      if (onAddIncome) {
        onAddIncome(data);
      }
    } catch (error) {
      console.error("Erro ao adicionar receita:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a receita",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Receita</DialogTitle>
          <DialogDescription>
            Adicione os detalhes da sua receita
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
                    <Input placeholder="Salário, freelance, etc." {...field} />
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
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonte</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma fonte" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fontes</SelectLabel>
                        {incomeSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
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
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adicionando..." : "Adicionar Receita"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeDialog;
