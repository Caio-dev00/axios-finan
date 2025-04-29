import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import { addBudget } from "@/services/budgetService";

const budgetFormSchema = z.object({
  category: z.string().min(1, "Selecione uma categoria"),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)), "O valor deve ser um número")
    .refine((val) => Number(val) > 0, "O valor deve ser maior que zero"),
  month: z.string().min(1, "Selecione um mês"),
  year: z
    .string()
    .refine((val) => !isNaN(Number(val)), "O ano deve ser um número")
    .refine(
      (val) => Number(val) >= new Date().getFullYear(),
      "O ano deve ser o atual ou futuro"
    ),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

const expenseCategories = [
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

const months = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

interface AddBudgetDialogProps {
  trigger?: React.ReactNode;
  onAddBudget?: (budget: BudgetFormValues) => void;
}

const AddBudgetDialog: React.FC<AddBudgetDialogProps> = ({
  trigger,
  onAddBudget,
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      amount: "",
      month: currentMonth.toString(),
      year: currentYear.toString(),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BudgetFormValues) => addBudget({
      category: data.category,
      amount: Number(data.amount),
      month: Number(data.month),
      year: Number(data.year),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["currentMonthBudgets"] });
      
      toast({
        title: "Orçamento adicionado",
        description: "Seu orçamento foi adicionado com sucesso",
      });
      
      form.reset({
        category: "",
        amount: "",
        month: currentMonth.toString(),
        year: currentYear.toString(),
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao adicionar orçamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o orçamento",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: BudgetFormValues) {
    try {
      mutation.mutate(data);
      
      if (onAddBudget) {
        onAddBudget(data);
      }
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o orçamento",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="flex items-center gap-2">
            <span>Novo Orçamento</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
          <DialogDescription>
            Defina um orçamento por categoria para o período
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Orçamento (R$)</FormLabel>
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Meses</SelectLabel>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
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
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={currentYear}
                        max={currentYear + 5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adicionando..." : "Adicionar Orçamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetDialog;
