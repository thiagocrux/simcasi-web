'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChartPie, CircleCheck, UserRoundPlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import FormValuesDebugger from '@/components/atoms/_FormValuesDebugger';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/atoms/Modal';
import { CreateAccountDTO, UpdateAccountDTO } from '@/services/types/accounts';

import {
  createAccountAction,
  getAccountAction,
  updateAccountAction,
} from '@/app/actions/accountActions';
import { getAllRolesAction } from '@/app/actions/roleActions';
import RadioGroup from '@/components/atoms/RadioGroup';

export default function AccountForm() {
  const router = useRouter();
  const { accountId } = useParams();
  const isUpdatingAccount = !!accountId && accountId !== 'new';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const schema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    role: z.string(),
  });

  type Inputs = z.infer<typeof schema>;

  const methods = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    reset,
    trigger,
  } = methods;

  // FIXME: Delete after testing
  const watchedValues = watch();

  const { data: getAccountResponse, isSuccess: isAccountLoaded } = useQuery({
    queryKey: ['accounts', accountId],
    queryFn: () => getAccountAction(accountId as string),
    enabled: isUpdatingAccount,
  });

  const { data: getAllRolesResponse } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRolesAction,
  });

  const createAccountMutation = useMutation({
    mutationFn: (data: CreateAccountDTO) => createAccountAction(data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: (data: UpdateAccountDTO) =>
      updateAccountAction(accountId as string, data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  useEffect(() => {
    console.log(getAllRolesResponse);
  }, [getAllRolesResponse]);

  useEffect(() => {
    if (isAccountLoaded && getAccountResponse) {
      const formData = {
        ...Object.fromEntries(
          Object.entries(getAccountResponse.data).map(([key, value]) => [
            key,
            value === null ? undefined : value,
          ])
        ),
      };

      reset(formData);

      setTimeout(() => {
        trigger();
      }, 100);
    }
  }, [isAccountLoaded, getAccountResponse, reset, trigger]);

  function handleRequestSuccess() {
    setIsModalOpen(true);
    reset();
  }

  async function onSubmit(data: Inputs) {
    const parsedData: CreateAccountDTO = {
      ...data,
    };

    if (isUpdatingAccount) {
      updateAccountMutation.mutate(parsedData);
    } else {
      createAccountMutation.mutate(parsedData);
    }
  }

  const isSubmitButtonDisabled = !isValid;

  const transtaledRoleLabels: Record<string, string> = {
    admin: 'Administrador',
    user: 'Usuário',
    viewer: 'Visitante',
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        hideCloseButton
        closeModal={() => setIsModalOpen(false)}
        customClasses="w-140 flex flex-col gap-y-4"
      >
        {/* TODO: Adjust modal content */}
        <div className="flex items-center justify-center gap-x-2">
          <CircleCheck size={20} className="text-success" />
          <p className="font-medium">{`O tratamento foi ${isUpdatingAccount ? 'atualizado' : 'cadastrado'} com sucesso!`}</p>
        </div>
        <div className="flex gap-x-2">
          {!isUpdatingAccount && (
            <Button
              id="create-new-patient-button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              customClasses="flex justify-center items-center gap-x-2"
            >
              <span>Cadastrar outro usuário</span>
              <UserRoundPlus size={16} />
            </Button>
          )}
          <Button
            id="dashboard-redirect-button"
            onClick={() => router.push('/dashboard')}
            customClasses="flex justify-center items-center gap-x-2"
          >
            <span>Ir para a dashboard</span>
            <ChartPie size={16} />
          </Button>
        </div>
      </Modal>

      <div className="flex flex-1 flex-col items-center justify-center pb-8">
        <h1 className="mb-8 text-2xl">{`${isUpdatingAccount ? 'Atualização' : 'Cadastro'} de usuário`}</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-[400px] flex-col gap-y-4"
          >
            <Input
              name="name"
              label="Nome"
              placeholder="Nome"
              errorMessage={errors.name?.message}
              control={control}
            />
            <Input
              name="email"
              label="E-mail"
              placeholder="E-mail"
              errorMessage={errors.email?.message}
              control={control}
            />
            {/* TODO: Adicionar checagem dupla para a senha */}
            <Input
              name="password"
              label="Senha"
              placeholder="Senha"
              errorMessage={errors.password?.message}
              control={control}
            />
            <RadioGroup
              name="role"
              label="Nível de autorização"
              options={
                getAllRolesResponse?.data
                  .map((role) => ({
                    label: transtaledRoleLabels[role.name],
                    value: role._id,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label)) || []
              }
              control={control}
            />
            <Button
              id="create-patient-button"
              type="submit"
              isDisabled={isSubmitButtonDisabled}
            >
              {isUpdatingAccount ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </FormProvider>

        <FormValuesDebugger watchedValues={watchedValues} />
      </div>
    </>
  );
}
