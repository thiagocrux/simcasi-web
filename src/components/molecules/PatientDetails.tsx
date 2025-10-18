import { PatientResponse } from '@/services/types/patients';
import { displayValue } from '@/utils/displayValue';
import { ReactNode } from 'react';

interface PatientDetailsProps {
  data: PatientResponse;
}

function Heading({ children }: { children: ReactNode }) {
  return <p className="my-4 font-bold">{children}</p>;
}

function Divider() {
  return (
    <div className="mx-2 flex-1 border-t-1 border-dashed border-gray-600" />
  );
}

export default function PatientDetails({ data }: PatientDetailsProps) {
  return (
    <div className="border-border rounded-lg border-1 p-8">
      {/* TODO: Transformar isso num aviso */}
      {data?.isDeceased && (
        <span className="border-error text-error rounded-full border-1 px-2 text-sm">
          Falecido
        </span>
      )}

      <Heading>Informações de cadastro:</Heading>

      <span className="flex items-center">
        <p>Número do cartão do SUS</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.susCardNumber)}</p>
      </span>
      <span className="flex items-center">
        <p>Tipo de monitoramento</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.monitoringType)}</p>
      </span>

      <Heading>Informações pessoais:</Heading>

      <span className="flex items-center">
        <p>CPF</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.cpf)}</p>
      </span>
      <span className="flex items-center">
        <p>Nome</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.name)}</p>
      </span>
      <span className="flex items-center">
        <p>Nome social</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.socialName)}</p>
      </span>
      <span className="flex items-center">
        <p>Data de nascimento</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.birthDate)}</p>
      </span>
      <span className="flex items-center">
        <p>Raça</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.race)}</p>
      </span>
      <span className="flex items-center">
        <p>Sexo</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.sex)}</p>
      </span>
      <span className="flex items-center">
        <p>Gênero</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.gender)}</p>
      </span>
      <span className="flex items-center">
        <p>Orientação sexual</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.sexuality)}</p>
      </span>
      <span className="flex items-center">
        <p>Nacionalidade</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.nationality)}</p>
      </span>
      <span className="flex items-center">
        <p>Escolaridade</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.schooling)}</p>
      </span>
      <span className="flex items-center">
        <p>Nome da mãe</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.motherName)}</p>
      </span>
      <span className="flex items-center">
        <p>Nome do pai</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.fatherName)}</p>
      </span>

      <Heading>Informações de contato:</Heading>

      <span className="flex items-center">
        <p>Telefone</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.phone)}</p>
      </span>
      <span className="flex items-center">
        <p>E-mail</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.email)}</p>
      </span>

      <Heading>Endereço:</Heading>

      <span className="flex items-center">
        <p>CEP</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.zipCode)}</p>
      </span>
      <span className="flex items-center">
        <p>Estado</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.state)}</p>
      </span>
      <span className="flex items-center">
        <p>Cidade</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.city)}</p>
      </span>
      <span className="flex items-center">
        <p>Bairro</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.neighborhood)}</p>
      </span>
      <span className="flex items-center">
        <p>Rua</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.street)}</p>
      </span>
      <span className="flex items-center">
        <p>Número da casa</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.houseNumber)}</p>
      </span>
      <span className="flex items-center">
        <p>Complemento</p>&nbsp;
        <Divider />
        <p>{displayValue(data?.complement)}</p>
      </span>
    </div>
  );
}
