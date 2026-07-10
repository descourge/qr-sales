"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  PackagePlus,
  Save,
} from "lucide-react";

import {
  notify,
} from "@/shared/lib/notify";

import {
  createArticle,
} from "@/features/articles/services/article.service";

import {
  getCategories,
} from "@/features/categories/services/category.service";

import {
  useSession,
} from "@/features/auth/context/SessionProvider";

import {
  Category,
} from "@/shared/types/article";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onCreated: () => void;
};

export default function ArticleForm({
  onCreated,
}: Props) {

  const {
    session,
  } = useSession();

  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({

    code: "",

    description: "",

    categoryId: 0,

    unitPrice: "",

  });

  useEffect(() => {

    if (!session) {

      return;

    }

    loadCategories(
      session.company.id
    );

  }, [session]);

  async function loadCategories(
    companyId: number
  ) {

    try {

      const data =
        await getCategories(
          companyId
        );

      setCategories(data);

    } catch {

      notify.error(
        "No fue posible cargar las categorías."
      );

    }

  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  }

  function resetForm() {

    setForm({

      code: "",

      description: "",

      categoryId: 0,

      unitPrice: "",

    });

  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!session) {

      return;

    }

    if (!form.code.trim()) {

      notify.error(
        "Debe ingresar un código."
      );

      return;

    }

    if (!form.description.trim()) {

      notify.error(
        "Debe ingresar una descripción."
      );

      return;

    }

    if (!form.categoryId) {

      notify.error(
        "Debe seleccionar una categoría."
      );

      return;

    }

    const price =
      Number(form.unitPrice);

    if (

      Number.isNaN(price) ||

      price <= 0

    ) {

      notify.error(
        "El precio debe ser mayor que cero."
      );

      return;

    }

    setLoading(true);

    try {

      await createArticle({

        companyId:
          session.company.id,

        categoryId:
          form.categoryId,

        code:
          form.code.trim(),

        description:
          form.description.trim(),

        unitPrice:
          price,

      });

      notify.success(
        "Artículo creado correctamente."
      );

      resetForm();

      onCreated();

    } catch {

      notify.error(
        "No fue posible crear el artículo."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <section
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
      "
    >

      <div className="mb-6 flex items-center gap-3">

        <PackagePlus
          size={24}
          className="text-[#3C83F6]"
        />

        <div>

          <h2
            className="
              text-xl
              font-bold
              text-[#333333]
            "
          >
            Nuevo artículo
          </h2>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Complete la información del producto.
          </p>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <div className="space-y-2">

            <Label htmlFor="code">
              Código
            </Label>

            <Input
              id="code"
              name="code"
              required
              maxLength={30}
              disabled={loading}
              placeholder="1001"
              value={form.code}
              onChange={handleChange}
            />

          </div>

          <div className="space-y-2">

            <Label>
              Categoría
            </Label>

            <Select

              disabled={loading}

              value={
                form.categoryId
                  ? String(
                      form.categoryId
                    )
                  : ""
              }

              onValueChange={(
                value
              ) =>

                setForm({

                  ...form,

                  categoryId:
                    Number(value),

                })

              }

            >

              <SelectTrigger>

                <SelectValue
                  placeholder="Seleccione una categoría"
                />

              </SelectTrigger>

              <SelectContent>

                {categories.map(
                  category => (

                    <SelectItem

                      key={category.id}

                      value={String(
                        category.id
                      )}

                    >

                      {category.name}

                    </SelectItem>

                  )
                )}

              </SelectContent>

            </Select>

          </div>

        </div>

        <div className="space-y-2">

          <Label htmlFor="description">
            Descripción
          </Label>

          <Input
            id="description"
            name="description"
            required
            maxLength={150}
            disabled={loading}
            placeholder="Coca Cola 350cc"
            value={form.description}
            onChange={handleChange}
          />

        </div>

        <div className="max-w-xs space-y-2">

          <Label htmlFor="unitPrice">
            Precio unitario
          </Label>

          <Input
            id="unitPrice"
            name="unitPrice"
            type="number"
            required
            min={1}
            step={1}
            inputMode="numeric"
            disabled={loading}
            placeholder="1800"
            value={form.unitPrice}
            onChange={handleChange}
          />

        </div>

        <div className="flex justify-end">

          <Button
            type="submit"
            disabled={loading}
            className="min-w-44"
          >

            <Save size={18} />

            {loading
              ? "Guardando..."
              : "Guardar artículo"}

          </Button>

        </div>

      </form>

    </section>

  );

}