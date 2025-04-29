
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addGoal } from "@/services/goalService";

const goalFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  targetAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)), "O valor deve ser um número")
    .refine((val) => Number(val) > 0, "O valor deve ser maior que zero"),
  currentAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)), "O valor deve ser um número")
    .refine((val) => Number(val) >= 0, "O valor não pode ser negativo"),
  targetDate: z.date().refine((date) => date > new Date(), "A data precisa ser no futuro"),
  description: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface AddGoalDialogProps {
  trigger?: React.ReactNode;
  onAddGoal?: (goal: GoalFormValues) => void;
}

const AddGoalDialog: React.FC<AddGoalDialogProps> = ({
  trigger,
  onAddGoal,
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Definir data padrão para 6 meses a partir de hoje
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 6);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      targetAmount: "",
      currentAmount: "0",
      targetDate: defaultDate,
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: GoalFormValues) => addGoal({
      title: data.title,
      target_amount: Number(data.targetAmount),
      current_amount: Number(data.currentAmount),
      target_date: data.targetDate,
      description: data.description,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      
      toast({
        title: "Meta adicionada",
        description: "Sua meta financeira foi adicionada com sucesso",
      });
      
      form.reset({
        title: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: defaultDate,
        description: "",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao adicionar meta:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a meta",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: GoalFormValues) {
    try {
      mutation.mutate(data);
      
      if (onAddGoal) {
        onAddGoal(data);
      }
    } catch (error) {
      console.error("Erro ao adicionar meta:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a meta",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="flex items-center gap-2">
            <span>Nova Meta</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Meta Financeira</DialogTitle>
          <DialogDescription>
            Defina uma nova meta financeira para realizar seus sonhos
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Férias, Novo Carro, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total da Meta (R$)</FormLabel>
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
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Atual Poupado (R$)</FormLabel>
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
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Alvo</FormLabel>
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
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes sobre sua meta financeira..."
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
                {mutation.isPending ? "Adicionando..." : "Adicionar Meta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
