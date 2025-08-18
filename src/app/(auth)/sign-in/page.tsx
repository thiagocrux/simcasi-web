'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { signInAction } from '@/app/actions/authActions';
import Input from '@/components/atoms/Input';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  EMAIL_REGEX,
  getInvalidFormatMessage,
  getRequiredMessage,
} from '@/utils/validation';

interface Inputs {
  email: string;
  password: string;
}

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
      .regex(EMAIL_REGEX, getInvalidFormatMessage('e-mail')),
    password: z.string().min(1, getRequiredMessage('senha')),
  });

  const methods = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
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
            hasError={!!errors.email && !response?.success}
            errorMessage={errors.email?.message}
          />

          <Input
            name="password"
            label="Senha"
            placeholder="Senha"
            hasError={!!errors.password && !response?.success}
            errorMessage={errors.password?.message}
          />

          {response?.success === false && (
            <p className="text-red-400">
              {response?.name === 'InvalidCredentialsError' &&
                'Credenciais inválidas.'}
            </p>
          )}

          <button type="submit" className="mt-4 cursor-pointer">
            Entrar
          </button>

          <p className="text-center text-blue-500">
            Esqueceu a senha? <u>Clique aqui.</u>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
