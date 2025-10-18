'use client';

import { signInAction } from '@/app/actions/authActions';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import InputErrorMessage from '@/components/atoms/InputErrorMessage';
import { REGEX } from '@/constants/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  getInvalidFormatMessage,
  getRequiredMessage,
} from '@/utils/validation';

interface ActionResult {
  success: boolean;
  message?: string;
  name?: string;
  statusCode?: number;
}

export default function SignInPage() {
  const [response, setResponse] = useState<ActionResult | null>(null);

  const schema = z.object({
    email: z
      .string()
      .min(1, getRequiredMessage('e-mail'))
      .regex(REGEX.email, getInvalidFormatMessage('e-mail')),
    password: z.string().min(1, getRequiredMessage('senha')),
  });

  type Inputs = z.infer<typeof schema>;

  const methods = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    control,
  } = methods;

  async function onSubmit(data: Inputs) {
    setResponse(null);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await signInAction(formData);
    setResponse(result);
  }

  const isSubmitButtonDisabled = !isValid && isDirty;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1>Seja bem-vindo(a)</h1>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-[400px] flex-col gap-y-4"
        >
          <Input
            name="email"
            label="E-mail"
            placeholder="E-mail"
            errorMessage={errors.email?.message}
            control={control}
          />
          <Input
            type="password"
            name="password"
            label="Senha"
            placeholder="Senha"
            errorMessage={errors.password?.message}
            control={control}
          />
          {response?.success === false &&
            response?.name === 'InvalidCredentialsError' && (
              <InputErrorMessage
                id="login-error-message"
                message="Credenciais inválidas."
              />
            )}
          <Button
            id="login-button"
            type="submit"
            isDisabled={isSubmitButtonDisabled}
          >
            Entrar
          </Button>
          <p className="text-center text-blue-500">
            Esqueceu a senha? <u>Clique aqui.</u>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
