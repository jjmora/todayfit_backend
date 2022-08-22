<?php

namespace App\Form;

use App\Entity\Franchise;
use App\Entity\Partner;
use App\Entity\Permission;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PartnerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('Name')
            ->add('Email')
            ->add('Address')
            ->add('Active')
            ->add('franchise', EntityType::class, [
              'class' => Franchise::class,
              'choice_label' => 'name',
              'multiple' => false,
              'placeholder' => ''
            ])
            ->add('Permissions', EntityType::class, [
              'class' => Permission::class,
              'choice_label' => 'name',
              'multiple' => true,
              'expanded' => true
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Partner::class,
        ]);
    }
}